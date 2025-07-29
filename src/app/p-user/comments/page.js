
import React from "react";
import connectToDB from "@/configs/db";
import Commentmodel from "@/models/Comment";
import { authUser } from "@/utils/auth-server";
import DataTable from "@/app/components/template/p-user/comments/DataTable";

const page = async () => {
  connectToDB();
  const user = await authUser();

  const comments = await Commentmodel.find(
    { userID: String(user._id) },
    "-__v"
  ).populate("CourseID", "title");





  return (
    <section className=" mt-14">

      <DataTable
        comments={JSON.parse(JSON.stringify(comments))}
        title="لیست کامنت‌ها"
      />

    </section>
  );
};

export default page;
