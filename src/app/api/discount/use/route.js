import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";

export async function PUT(req) {
  try {
    await connectToDB();

    const { code } = await req.json();
    if (!code) {
      return Response.json({ message: "Discount code is required" }, { status: 400 });
    }

    const discount = await DiscountModel.findOne({ code: code.trim() });
    if (!discount) {
      return Response.json({ message: "Code not found !!" }, { status: 404 });
    }

    if (discount.uses >= discount.maxUse) {
      return Response.json({ message: "Code usage limit reached" }, { status: 422 });
    }

    // افزایش تعداد استفاده
    discount.uses += 1;
    await discount.save();

    return Response.json(discount);

  } catch (err) {
    console.error("Error using discount:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
