import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    connectToDB();

    const body = await req.json();
    const { id } = body;

    // ✅ Validation
    if (!id) {
      return Response.json({ message: "شناسه کامنت ارسال نشده است" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: "شناسه کامنت نامعتبر است" }, { status: 400 });
    }

    const comment = await CommentModel.findById(id);
    if (!comment) {
      return Response.json({ message: "کامنت مورد نظر یافت نشد" }, { status: 404 });
    }

    await CommentModel.findByIdAndUpdate(id, {
      $set: {
        isAccept: false,
      },
    });

    return Response.json({ message: "کامنت با موفقیت رد شد :))" });
  } catch (err) {
    console.log(err);
    return Response.json({ message: "خطایی در سرور رخ داده است" }, { status: 500 });
  }
}
