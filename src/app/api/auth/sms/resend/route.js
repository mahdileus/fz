import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { phone } = body;

    // اعتبارسنجی شماره موبایل
    if (!phone || !/^09\d{9}$/.test(phone)) {
      return Response.json({ message: "شماره موبایل معتبر نیست" }, { status: 400 });
    }

    // بررسی وجود کاربر
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return Response.json({ message: "کاربری با این شماره پیدا نشد" }, { status: 404 });
    }

    // بررسی تعداد درخواست‌های اخیر
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await OtpModel.countDocuments({ phone, createdAt: { $gte: oneHourAgo } });
    if (recentOtps >= 5) {
      return Response.json({ message: "تعداد درخواست‌های شما بیش از حد مجاز است" }, { status: 429 });
    }

    // حذف OTPهای قبلی
    await OtpModel.deleteMany({ phone });

    // تولید OTP جدید
    const code = Math.floor(10000 + Math.random() * 89999);
    const expTime = Date.now() + 5 * 60 * 1000;

    // ذخیره OTP در DB
    await OtpModel.create({
      phone,
      code: String(code),
      expiresAt: new Date(expTime),
    });


    // ارسال SMS با fetch
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
      return Response.json({ message: "خطا در ارسال کد" }, { status: 500 });
    }

    return Response.json({ message: "کد جدید ارسال شد" }, { status: 201 });
  } catch (err) {
    console.error("Resend OTP Error ->", err);
    return Response.json({ message: "خطا در سرور", error: err.message }, { status: 500 });
  }
}
