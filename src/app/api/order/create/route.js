import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import CourseModel from "@/models/Course";
import DiscountCodeModel from "@/models/Discount";
import connectToDB from "@/configs/db";

export async function POST(req) {
  try {
    await connectToDB();
    const { userId, items, discountCode } = await req.json();

    // 1️⃣ بررسی وجود کاربر
    const user = await UserModel.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "کاربر پیدا نشد" }), { status: 404 });
    }

    // 2️⃣ بررسی سبد خرید
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "سبد خرید خالی است" }), { status: 400 });
    }

    // 3️⃣ محاسبه مبلغ کل و جمع‌آوری آیدی دوره‌ها
    let totalAmount = 0;
    const courseIds = [];

    for (const item of items) {
      const course = await CourseModel.findById(item._id);
      if (!course) {
        return new Response(JSON.stringify({ error: `دوره با آیدی ${item._id} پیدا نشد` }), { status: 404 });
      }
      if (!item.price) {
        return new Response(JSON.stringify({ error: `قیمت برای دوره ${item._id} مشخص نشده است` }), { status: 400 });
      }
      totalAmount += item.price; // استفاده از قیمت ارسالی از فرانت‌اند
      courseIds.push(course._id);
    }

    // 4️⃣ اعمال کد تخفیف
    let discountPercent = 0;
    if (discountCode) {
      const discount = await DiscountCodeModel.findOne({ code: discountCode});
      if (!discount) {
        return new Response(JSON.stringify({ error: "کد تخفیف نامعتبر است" }), { status: 400 });
      }
      if (discount.expiresAt < new Date()) {
        return new Response(JSON.stringify({ error: "کد تخفیف منقضی شده است" }), { status: 400 });
      }
      discountPercent = discount.percent;
      totalAmount = totalAmount * (1 - discountPercent / 100); // اعمال تخفیف
    }

    // 5️⃣ ایجاد سفارش در دیتابیس
    const order = await OrderModel.create({
      user: user._id,
      courses: courseIds,
      amount: totalAmount,
      discountCode: discountCode || null,
      discountPercent,
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
          amount: Math.round(totalAmount * 10), // تبدیل به ریال
          callback_url: `${process.env.ZARINPAL_CALLBACK}?orderId=${order._id}`,
          description: `خرید ${courseIds.length} دوره توسط ${user.name}`,
        }),
      }
    );

    const data = await zarinRes.json();

    // 7️⃣ بررسی پاسخ زرین‌پال
    if (data?.data?.authority) {
      order.authority = data.data.authority;
      await order.save();

      return new Response(
        JSON.stringify({
          url: `https://www.zarinpal.com/pg/StartPay/${order.authority}`,
        }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ error: "خطا در ایجاد تراکنش" }), { status: 500 });
  } catch (error) {
    console.error("خطا در ایجاد سفارش:", error);
    return new Response(JSON.stringify({ error: "خطا در ایجاد سفارش" }), { status: 500 });
  }
}