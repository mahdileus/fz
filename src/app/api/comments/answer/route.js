import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { authUser } from "@/utils/auth-server";

export async function POST(req) {
  try {
    connectToDB();
    const reqBody = await req.json();
    const { body, commentID } =
      reqBody;
    const user = await authUser();    

    await CommentModel.findOneAndUpdate(
      { _id: commentID },
      {
        $set: {
          hasAnswer: true,
        },
      }
    );

    await CommentModel.create({
      body,
      userID: user._id,
      hasAnswer: false,
      isAnswer: true,
      mainComment: commentID,
        username: user.name || "ادمین ناشناس",
  email: user.email || "admin@example.com",
    });

    return Response.json(
      { message: "Answer saved successfully :))" },
      { status: 201 }
    );
  } catch (err) {

    return Response.json({ message: err }, { status: 500 });
  }
}
