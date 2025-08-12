import connectToDB from "@/configs/db";
import BanModel from "@/models/Ban";
import { authAdmin } from "@/utils/auth-server";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();

    if (!isAdmin) {
      throw new Error("This api protected and you can't access it !!");
    }
    await connectToDB();
    const { email, phone } = await req.json();

    if (!phone) {
      return Response.json({ message: "شماره موبایل الزامی است" }, { status: 400 });
    }

    const isAlreadyBanned = await BanModel.findOne({ phone });
    if (isAlreadyBanned) {
      return Response.json({ message: "کاربر از قبل بن شده است" }, { status: 409 });
    }

    await BanModel.create({ email, phone });

    return Response.json({ message: "کاربر بن شد" }, { status: 201 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    const { phone } = await req.json();

    if (!phone) {
      return Response.json({ message: "شماره موبایل الزامی است" }, { status: 400 });
    }

    await BanModel.deleteOne({ phone });

    return Response.json({ message: "کاربر از بن خارج شد" }, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const bannedUsers = await BanModel.find({}, { phone: 1, _id: 0 });
    const bannedPhones = bannedUsers.map((user) => user.phone);
    return Response.json({ bannedPhones });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}
