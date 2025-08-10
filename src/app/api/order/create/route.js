import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import CourseModel from "@/models/Course";
import connectToDB from "@/configs/db";


export async function POST(req) {
  try {
    await connectToDB();
    const { userId, items, discountCode } = await req.json();

    const user = await UserModel.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "کاربر پیدا نشد" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "سبد خرید خالی است" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let totalAmount = 0;
    const courseIds = [];

    for (const item of items) {
      const course = await CourseModel.findById(item._id);
      if (!course) {
        return new Response(
          JSON.stringify({ error: `دوره با آیدی ${item._id} پیدا نشد` }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      totalAmount += course.discountedPrice || course.price;
      courseIds.push(course._id);
    }

    // TODO: تخفیف کد را در اینجا اعمال کن

    const order = await OrderModel.create({
      user: user._id,
      courses: courseIds,
      amount: totalAmount,
      status: "pending",
      paymentGateway: "zarinpal",
    });

    const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
    const ZARINPAL_CALLBACK_URL = process.env.ZARINPAL_CALLBACK_URL;

    const zarinRes = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/request.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: ZARINPAL_MERCHANT_ID,
          amount: totalAmount * 10,
          callback_url: `${ZARINPAL_CALLBACK_URL}?orderId=${order._id}`,
          description: `خرید دوره‌ها توسط ${user.name}`,
        }),
      }
    );

    const data = await zarinRes.json();

    if (data.data?.authority) {
      order.authority = data.data.authority;
      await order.save();

      return new Response(
        JSON.stringify({
          url: `https://www.zarinpal.com/pg/StartPay/${order.authority}`,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "خطا در ایجاد تراکنش" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "خطا در ایجاد سفارش" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
