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

    if (!orderId || !authority || !status) {
      return new Response(
        JSON.stringify({ error: "پارامترهای لازم موجود نیست" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const order = await OrderModel.findById(orderId).populate("courses user");
    if (!order) {
      return new Response(
        JSON.stringify({ error: "سفارش پیدا نشد" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (status !== "OK") {
      order.status = "failed";
      await order.save();
      return new Response(null, {
        status: 302,
        headers: { Location: "/payment-failed" },
      });
    }

    const verifyRes = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/verify.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: order.amount * 10,
          authority: authority,
        }),
      }
    );

    const data = await verifyRes.json();

    if (data.data?.code === 100) {
      order.status = "paid";
      order.refId = data.data.ref_id;
      await order.save();

      // ثبت دوره‌های خریداری شده توسط کاربر
      for (const courseId of order.courses) {
        await UserCourse.create({
          user: order.user._id,
          course: courseId,
        });
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: `/payment-success?courseId=${order.courses[0]}`, 
        },
      });
    }

    order.status = "failed";
    await order.save();
    return new Response(null, {
      status: 302,
      headers: { Location: "/payment-failed" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "خطا در تایید تراکنش" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
