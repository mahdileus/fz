import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment"
import CourseModel from "@/models/Course"
import { authUser } from "@/utils/auth-server";
export async function POST (req){
    try{
       connectToDB()
           const user = await authUser();    
    const reqBody = await req.json();
    const {username, body, email, score, CourseID} = reqBody;

    const comment = await CommentModel.create({
        username, body, email, score, CourseID, user: user._id,
    });

    const uptdatedProduct = await CourseModel.findOneAndUpdate({
        _id: CourseID,},
        {  
            $push:{
                comments: comment._id,
            }
    })

    return Response.json({
        message:"comment created succesfully",
        data:comment,
    }, {status:201})   
    } catch(err){
        return Response.json({message : err}, {status:500});
    }
  
}
export async function GET (){
    await CommentModel.findOneAndUpdate({},{
        isAccept: true,
    })
    const comments = await CommentModel.find({},"-__v")
    return Response.json(comments)

}