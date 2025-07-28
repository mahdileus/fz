import React from "react";
import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import DataTable from "@/app/components/template/p-admin/users/DataTable";

const page = async () => {
  connectToDB();
  const users = await UserModel.find({}).lean();

  return (
    <section className=" mt-14">
        {users.length === 0 ? (
          <p className={styles.empty}>کاربری وجود ندارد</p>
        ) : (
          <DataTable
            users={JSON.parse(JSON.stringify(users))}
            title="لیست کاربران"
          />
        )}
      </section>
  );
};

export default page;
