import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { authAdmin } from "@/utils/auth-server";
import { redirect } from "next/navigation";

export async function PUT(req) {
  try {

    connectToDB();
        const isAdmin = await authAdmin();

      if (!isAdmin) {
        redirect("/404")
      }
    const body = await req.json();
    const { id } = body;

    const user = await UserModel.findOne({ _id: id }).lean();
    await UserModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          role: user.role === "USER" ? "ADMIN" : "USER",
        },
      }
    );

    return Response.json({ message: "User role updated successfully" });
  } catch (err) {
    return Response.json(
      { message: err },
      {
        status: 500,
      }
    );
  }
}
