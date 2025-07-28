import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { authUser } from "@/utils/auth-server";
import { validateEmail, validatePhone } from "@/utils/auth-client";

export async function POST(req) {
  try {
    await connectToDB();
    const user = await authUser();
    const body = await req.json();
    const { name, email, phone } = body;

    // ✅ Validation
    if (!name || name.trim().length < 3) {
      return Response.json({ message: "نام باید حداقل ۳ کاراکتر باشد" }, { status: 400 });
    }

    if (email && !validateEmail(email)) {
      return Response.json({ message: "ایمیل وارد شده معتبر نیست" }, { status: 400 });
    }

    if (!phone || !validatePhone(phone)) {
      return Response.json({ message: "شماره موبایل معتبر نیست" }, { status: 400 });
    }

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          name,
          email,
          phone,
        },
      }
    );

    return Response.json(
      { message: "اطلاعات با موفقیت ویرایش شد" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { id } = body;

    // ✅ Validation
    if (!id || typeof id !== "string" || id.length < 10) {
      return Response.json({ message: "شناسه کاربر معتبر نیست" }, { status: 400 });
    }

    const deleted = await UserModel.findOneAndDelete({ _id: id });

    if (!deleted) {
      return Response.json({ message: "کاربری با این شناسه پیدا نشد" }, { status: 404 });
    }

    return Response.json({ message: "کاربر با موفقیت حذف شد" }, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}

