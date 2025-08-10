import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";

export async function POST(req) {
  try {
    await connectToDB();

    const { code, percent, maxUse } = await req.json();

    // Validation
    if (!code || !percent || !maxUse) {
      return Response.json(
        { message: "All fields (code, percent, maxUse) are required" },
        { status: 400 }
      );
    }

    if (percent <= 0 || percent > 100) {
      return Response.json(
        { message: "Percent must be between 1 and 100" },
        { status: 422 }
      );
    }

    if (maxUse <= 0) {
      return Response.json(
        { message: "Max use must be greater than 0" },
        { status: 422 }
      );
    }

    // Check duplicate
    const existing = await DiscountModel.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return Response.json(
        { message: "Discount code already exists" },
        { status: 409 }
      );
    }

    await DiscountModel.create({
      code: code.trim().toUpperCase(),
      percent,
      maxUse,
    });

    return Response.json(
      { message: "Discount code created successfully :))" },
      { status: 201 }
    );

  } catch (err) {
    console.error("Error creating discount:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
