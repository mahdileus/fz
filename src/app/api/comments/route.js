import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import CourseModel from "@/models/Course";
import { authUser } from "@/utils/auth-server";
import UserModel from "@/models/User";

export async function POST(req) {
  try {
    connectToDB();
    
    const user = await authUser(); // ✅ گرفتن یوزر لاگین‌شده

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const reqBody = await req.json();
    const { username, body, email, score, CourseID } = reqBody;

    const comment = await CommentModel.create({
      username,
      body,
      email,
      score,
      CourseID,
      userID: user._id, // ✅ اینجاست راه‌حل
    });

    await CourseModel.findByIdAndUpdate(CourseID, {
      $push: { comments: comment._id },
    });

    await UserModel.findByIdAndUpdate(user._id, {
      $push: { comments: comment._id },
    });

    return Response.json({
      message: "Comment created successfully",
      data: comment,
    }, { status: 201 });

  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}

