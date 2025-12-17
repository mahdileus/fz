import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return Response.json({ message: "شماره تلفن وارد نشده است" }, { status: 400 });
    }

    // 1️⃣ بررسی وجود کاربر
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return Response.json({ message: "کاربری با این شماره پیدا نشد" }, { status: 404 });
    }

    // 2️⃣ حذف OTPهای قبلی همین شماره
    await OtpModel.deleteMany({ phone });

    // 3️⃣ تولید کد ۵ رقمی
    const code = Math.floor(10000 + Math.random() * 89999);
    const expTime = Date.now() + 5 * 60 * 1000; // 5 دقیقه

    // 4️⃣ ارسال SMS
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
      console.error("Error sending OTP:", data);
      return Response.json(
        { message: "خطا در ارسال کد، لطفا دوباره امتحان کنید" },
        { status: 500 }
      );
    }

    // 5️⃣ ذخیره OTP در دیتابیس
    await OtpModel.create({
      phone,
      code: String(code),
      expiresAt: new Date(expTime),
    });

    return Response.json({ message: "کد ورود ارسال شد" }, { status: 201 });
  } catch (err) {
    console.error("OTP Login Error ->", err);
    return Response.json({ message: "خطا در سرور", error: err.message }, { status: 500 });
  }
}
