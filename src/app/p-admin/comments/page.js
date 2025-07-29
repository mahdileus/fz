import React from "react";
import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import DataTable from "@/app/components/template/p-admin/comments/DataTable";


const page = async () => {
  connectToDB();
const comments = await CommentModel.find({})
  .sort({ _id: -1 })
      .populate("userID")
  .populate("CourseID") // فقط فیلدهای لازم
  .lean();
   

  return (
    <section className=" mt-14">
        {comments.length === 0 ? (
          <p>کامنتی وجود ندارد</p>
        ) : (
          <DataTable
            comments={JSON.parse(JSON.stringify(comments))}
            title="لیست کامنت‌ها"
          />
        )}
      </section>
  );
};

export default page;
