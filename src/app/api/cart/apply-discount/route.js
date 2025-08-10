import connectToDB from "@/configs/db";
import Cart from "@/models/Cart";
import Discount from "@/models/Discount";

export async function POST(req) {
  try {
    await connectToDB();
    const { userId, code } = await req.json();

    const discount = await Discount.findOne({ code });
    if (!discount) {
      return Response.json({ message: "کد تخفیف معتبر نیست" }, { status: 404 });
    }


    if (discount.maxUse && discount.usedCount >= discount.maxUse) {
      return Response.json({ message: "کد تخفیف دیگر قابل استفاده نیست" }, { status: 400 });
    }


    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return Response.json({ message: "سبد خرید خالی است" }, { status: 400 });
    }

    cart.discount = {
      code: discount.code,
      percent: discount.percent
    };

    const totalBeforeDiscount = cart.items.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = (totalBeforeDiscount * discount.percent) / 100;
    cart.totalPrice = Math.round(totalBeforeDiscount - discountAmount);

    await cart.save();
    await cart.populate("items.course");

    return Response.json({ message: "کد تخفیف اعمال شد", cart });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
