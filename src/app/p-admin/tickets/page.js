import React from "react";

import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import DataTable from "@/app/components/template/p-admin/tickets/Table";

const page = async () => {
  connectToDB();
  const tickets = await TicketModel.find({ isAnswer: false })
    .sort({ _id: -1 })
    .populate("user")
    .populate("department")

    .lean();

  return (

    <section className=" mt-14">
        {tickets.length === 0 ? (
          <p>تیکتی وجود ندارد</p>
        ) : (
          <DataTable
            tickets={JSON.parse(JSON.stringify(tickets))}
            title="لیست تیکت‌ها"
          />
        )}
      </section>
  );
};

export default page;
