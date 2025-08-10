import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import CourseModel from "@/models/Course";
import connectToDB from "@/configs/db";

export async function POST(req) {
  try {
    await connectToDB();
    const { userId, items, discountCode } = await req.json();

    // 1️⃣ بررسی وجود کاربر
    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    // 2️⃣ بررسی سبد خرید
    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }

    // 3️⃣ محاسبه مبلغ کل و جمع‌آوری آیدی دوره‌ها
    let totalAmount = 0;
    const courseIds = [];

    for (const item of items) {
      const course = await CourseModel.findById(item._id);
      if (!course) {
        return Response.json(
          { error: `دوره با آیدی ${item._id} پیدا نشد` },
          { status: 404 }
        );
      }
      totalAmount += course.discountedPrice || course.price;
      courseIds.push(course._id);
    }

    // 4️⃣ TODO: اعمال کد تخفیف در این بخش

    // 5️⃣ ایجاد سفارش در دیتابیس
    const order = await OrderModel.create({
      user: user._id,
      courses: courseIds,
      amount: totalAmount,
      status: "pending",
      paymentGateway: "zarinpal",
    });

    // 6️⃣ ارسال درخواست به زرین‌پال
    const zarinRes = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/request.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: totalAmount * 10, // تبدیل به ریال
          callback_url: `${process.env.ZARINPAL_CALLBACK_URL}?orderId=${order._id}`,
          description: `خرید ${courseIds.length} دوره توسط ${user.name}`,
        }),
      }
    );

    const data = await zarinRes.json();

    // 7️⃣ بررسی پاسخ زرین‌پال
    if (data?.data?.authority) {
      order.authority = data.data.authority;
      await order.save();

      return Response.json({
        url: `https://www.zarinpal.com/pg/StartPay/${order.authority}`,
      });
    }

    return Response.json({ error: "خطا در ایجاد تراکنش" }, { status: 500 });
  } catch (error) {
    console.error("خطا در ایجاد سفارش:", error);
    return Response.json({ error: "خطا در ایجاد سفارش" }, { status: 500 });
  }
}
