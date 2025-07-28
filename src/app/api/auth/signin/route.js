import {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
} from "@/utils/auth-server";

import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/utils/auth-client";

import UserModel from "@/models/User";
import connectToDB from "@/configs/db"

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { phoneOrEmail, password } = body;

    const isValidEmail = validateEmail(phoneOrEmail);
    const isValidPhone = validatePhone(phoneOrEmail);
    const isValidPassword = validatePassword(password);

    if (!isValidPassword || (!isValidEmail && !isValidPhone)) {
      return Response.json(
        { message: "ایمیل یا شماره موبایل یا رمزعبور نامعتبر است" },
        { status: 419 }
      );
    }

    // پیدا کردن کاربر با ایمیل یا تلفن
    const user = await UserModel.findOne({
      $or: [{ email: phoneOrEmail }, { phone: phoneOrEmail }],
    });

    if (!user) {
      return Response.json({ message: "کاربر پیدا نشد" }, { status: 422 });
    }

    const isCorrectPasswordWithHash = await verifyPassword(
      password,
      user.password
    );

    if (!isCorrectPasswordWithHash) {
      return Response.json(
        { message: "رمز عبور نادرست است" },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken({ phone: user.phone });
    const refreshToken = generateRefreshToken({ phone: user.phone });

    await UserModel.findOneAndUpdate(
      { phone: user.phone },
      { $set: { refreshToken } }
    );

    return Response.json(
      { message: "ورود با موفقیت انجام شد" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${accessToken};path=/;httpOnly=true;`,
        },
      }
    );
  } catch (err) {
    console.log("Err ->", err);
    return Response.json(
      { message: "خطا در سرور", error: err.message },
      {
        status: 500,
      }
    );
  }
}