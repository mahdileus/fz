import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";

// اگر بخوای از fetch استفاده کنی، نیازی به request نیست
export async function POST(req) {
  try {
    // 1️⃣ اتصال به دیتابیس
    await connectToDB();

    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return Response.json(
        { message: "شماره تلفن وارد نشده است" },
        { status: 400 }
      );
    }

    // 2️⃣ بررسی وجود کاربر
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return Response.json(
        { message: "کاربر با این شماره قبلا ثبت‌نام کرده است!" },
        { status: 422 }
      );
    }

    // 3️⃣ تولید کد OTP (همیشه 5 رقمی)
    const code = Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const expTime = now.getTime() + 5 * 60 * 1000; // 5 دقیقه

    // 4️⃣ ارسال SMS با fetch به جای request
    const smsResponse = await fetch("http://ippanel.com/api/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        op: "pattern",
        user: process.env.IPPANEL_USER,
        pass: process.env.IPPANEL_PASS,
        fromNum: "3000505",
        toNum: phone,
        patternCode: "uoofkyutz5lvv4r",
        inputData: [{ "verification-code": code }],
      }),
    });

    const data = await smsResponse.json();

    if (!smsResponse.ok) {
      return Response.json(
        { message: "خطا در ارسال کد، لطفا بعدا دوباره امتحان کنید" },
        { status: 500 }
      );
    }

    // 5️⃣ ذخیره OTP در دیتابیس
    await OtpModel.create({
      phone,
      code: String(code),
      expiresAt: new Date(expTime),
    });


    // 6️⃣ پاسخ موفق
    return Response.json(
      { message: "کد با موفقیت ارسال شد :))" },
      { status: 201 }
    );
  } catch (err) {
    console.log("Err ->", err);
    return Response.json(
      { message: "خطا در سرور", error: err.message },
      { status: 500 }
    );
  }
}
