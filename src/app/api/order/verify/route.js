import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import UserCourse from "@/models/UserCourse";
import { NextResponse } from 'next/server'; // مطمئن شو که NextResponse ایمپورت شده (اگر Response مستقیماً کار نمی‌کنه)

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    // 📜 لاگ ورودی‌ها برای دیباگ
    console.log("📥 Params from Zarinpal callback:", {
      orderId,
      authority,
      status,
    });

    // 1️⃣ بررسی پارامترهای ضروری
    if (!orderId || !authority || !status) {
      return NextResponse.json(
        {
          error: "پارامترهای لازم موجود نیست",
          received: { orderId, authority, status },
        },
        { status: 400 }
      );
    }

    // 2️⃣ پیدا کردن سفارش
    let order;
    try {
      order = await OrderModel.findById(orderId)
        .populate("courses")
        .populate("user");
    } catch (dbErr) {
      return NextResponse.json(
        {
          error: "شناسه سفارش نامعتبر است",
          details: dbErr.message,
        },
        { status: 400 }
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          error: "سفارش پیدا نشد",
          receivedOrderId: orderId,
        },
        { status: 404 }
      );
    }

    // 3️⃣ اگر پرداخت لغو شده باشد
    if (status !== "OK") {
      order.status = "failed";
      await order.save();
      const failedUrl = `${process.env.SITE_URL}${process.env.PAYMENT_FAILED_URL || "/payment-failed"}`;
      return NextResponse.redirect(failedUrl);
    }

    // 4️⃣ ارسال درخواست تایید به زرین‌پال
    const verifyRes = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/verify.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: order.amount * 10, // تبدیل تومان به ریال (با PRICE_UNIT=toman)
          authority,
        }),
      }
    );

    const data = await verifyRes.json();
    console.log("✅ Verify response from Zarinpal:", JSON.stringify(data, null, 2));

    // 5️⃣ تایید موفق
    if (data?.data?.code === 100) {
      order.status = "paid";
      order.refId = data.data.ref_id;
      await order.save();

      // ثبت دوره‌ها برای کاربر (بدون تکرار)
      for (const course of order.courses) {
        const exists = await UserCourse.findOne({
          user: order.user._id,
          course: course._id,
        });

        if (!exists) {
          await UserCourse.create({
            user: order.user._id,
            course: course._id,
          });
        }
      }

      // ساخت URL کامل برای ریدایرکت موفق
      const successUrl = `${process.env.SITE_URL}${process.env.PAYMENT_SUCCESS_URL || "/payment-success"}?orderId=${order._id}`;
      return NextResponse.redirect(successUrl);
    }

    // 6️⃣ تایید ناموفق
    order.status = "failed";
    await order.save();
    
    // ساخت URL کامل برای ریدایرکت ناموفق
    const failedUrl = `${process.env.SITE_URL}${process.env.PAYMENT_FAILED_URL || "/payment-failed"}?reason=${
      data?.errors?.message || "پرداخت تایید نشد"
    }`;
    return NextResponse.redirect(failedUrl);
  } catch (error) {
    console.error("❌ خطا در تایید تراکنش:", error);
    return NextResponse.json(
      { error: "خطا در تایید تراکنش", details: error.message },
      { status: 500 }
    );
  }
}