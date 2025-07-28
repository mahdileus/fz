import UserModel from "@/models/User";
import connectToDB from "@/configs/db";
import { verifyAccessToken } from "@/utils/auth-server";
import { cookies } from "next/headers";

export async function GET() {
  await connectToDB(); // حتماً منتظر اتصال بمان

  const cookieStore = await cookies(); // ✅ باید await بزنی
  const token = cookieStore.get("token");

  if (!token) {
    return Response.json(
      {
        data: null,
        message: "عدم دسترسی: توکن یافت نشد!",
      },
      { status: 401 }
    );
  }

  try {
    const tokenPayload = verifyAccessToken(token.value);
    const user = await UserModel.findOne(
      { phone: tokenPayload.phone },
      "-password -refreshToken -__v" // حذف فیلدهای حساس
    );

    if (!user) {
      return Response.json(
        { data: null, message: "کاربر یافت نشد!" },
        { status: 404 }
      );
    }

    return Response.json({
        _id: user._id,
      email: user.email,
      role: user.role,
      phone: user.phone,
      name: user.name,
    });
  } catch (err) {
    return Response.json(
      { data: null, message: "توکن نامعتبر است" },
      { status: 403 }
    );
  }
}
