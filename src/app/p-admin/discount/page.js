import React from "react";

import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";
import AddDiscount from "@/app/components/template/p-admin/discounts/AddDiscount";
import Table from "@/app/components/template/p-admin/discounts/Table";


const Discounts = async () => {
  connectToDB();
  const discounts = await DiscountModel.find({}).sort({ _id: -1 }).lean();

  return (

    <section className=" mt-14">
        <AddDiscount />
        {discounts.length === 0 ? (
          <p>کدتخفیفی وجود ندارد</p>
        ) : (
          <Table
            discounts={JSON.parse(JSON.stringify(discounts))}
            title="لیست تخفیف ها"
          />
        )}
      </section>
  );
};

export default Discounts;
