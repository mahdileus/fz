import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";
import { generateAccessToken } from "@/utils/auth-server";
import { roles } from "@/utils/constants";

export async function POST(req) {
  await connectToDB(); // حتماً منتظر اتصال بمانیم
  const body = await req.json();
  const { phone, code } = body;
  const email = `${phone}@gmail.com`;

  // ✅ Validation
  const phoneRegex = /^09\d{9}$/;
  const codeRegex = /^\d{5}$/;

  if (!phone || !code) {
    return Response.json({ message: "شماره یا کد ارسال نشده است" }, { status: 400 });
  }

  if (!phoneRegex.test(phone)) {
    return Response.json({ message: "شماره موبایل معتبر نیست" }, { status: 400 });
  }

  if (!codeRegex.test(code)) {
    return Response.json({ message: "کد تأیید معتبر نیست (باید ۵ رقم عددی باشد)" }, { status: 400 });
  }

  // ادامه‌ی منطقی
  const otp = await OtpModel.findOne({ phone, code });

  if (otp) {
    const now = Date.now();

    if (otp.expTime > now) {
      const accessToken = generateAccessToken({ phone });

      const users = await UserModel.find({});

      await UserModel.create({
        email,
        phone,
        role: users.length > 0 ? roles.USER : roles.ADMIN,
      });

      return Response.json(
        { message: "کد صحیح است" },
        {
          status: 200,
          headers: {
            "Set-Cookie": `token=${accessToken};path=/;httpOnly=true`,
          },
        }
      );
    } else {
      return Response.json({ message: "کد منقضی شده است" }, { status: 410 });
    }
  } else {
    return Response.json(
      { message: "کد اشتباه است" },
      { status: 409 }
    );
  }
}
