import connectToDB from "@/configs/db";
import Discount from "@/models/Discount";

export async function DELETE(req, { params }) {
  const { id } = await params;

  await connectToDB();

  try {
    const deleted = await Discount.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(
        JSON.stringify({ message: "کد تخفیف یافت نشد" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ message: "کد تخفیف حذف شد" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "خطا در حذف کد تخفیف" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
