import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import UserCourse from "@/models/UserCourse";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    // 1️⃣ بررسی پارامترهای ضروری
    if (!orderId || !authority || !status) {
      return Response.json({ error: "پارامترهای لازم موجود نیست" }, { status: 400 });
    }

    // 2️⃣ پیدا کردن سفارش
    const order = await OrderModel.findById(orderId)
      .populate("courses")
      .populate("user");

    if (!order) {
      return Response.json({ error: "سفارش پیدا نشد" }, { status: 404 });
    }

    // 3️⃣ اگر پرداخت لغو شده باشد
    if (status !== "OK") {
      order.status = "failed";
      await order.save();
      return Response.redirect(process.env.PAYMENT_FAILED_URL || "/payment-failed");
    }

    // 4️⃣ ارسال درخواست تایید به زرین‌پال
    const verifyRes = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/verify.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: order.amount * 10, // تبدیل به ریال
          authority,
        }),
      }
    );

    const data = await verifyRes.json();

    // 📜 لاگ برای دیباگ
    console.log("Verify response from Zarinpal:", JSON.stringify(data, null, 2));

    // 5️⃣ تایید موفق
    if (data?.data?.code === 100) {
      order.status = "paid";
      order.refId = data.data.ref_id;
      await order.save();

      // 6️⃣ ثبت دوره‌ها برای کاربر (جلوگیری از ثبت تکراری)
      for (const course of order.courses) {
        const alreadyExists = await UserCourse.findOne({
          user: order.user._id,
          course: course._id,
        });

        if (!alreadyExists) {
          await UserCourse.create({
            user: order.user._id,
            course: course._id,
          });
        }
      }

      return Response.redirect(
        `${process.env.PAYMENT_SUCCESS_URL || "/payment-success"}?orderId=${order._id}`
      );
    }

    // 7️⃣ تایید ناموفق
    order.status = "failed";
    await order.save();

    // ارسال دلیل شکست به کاربر
    return Response.redirect(
      `${process.env.PAYMENT_FAILED_URL || "/payment-failed"}?reason=${data?.errors?.message || "پرداخت تایید نشد"}`
    );

  } catch (error) {
    console.error("خطا در تایید تراکنش:", error);
    return Response.json({ error: "خطا در تایید تراکنش" }, { status: 500 });
  }
}
