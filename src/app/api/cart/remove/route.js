import connectToDB from "@/configs/db";
import Cart from "@/models/Cart";

export async function POST(req) {
  try {
    await connectToDB();
    const { userId, courseId } = await req.json();

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return Response.json({ message: "سبد خرید خالی است" }, { status: 200 });
    }

    cart.items = cart.items.filter(item => !item.course.equals(courseId));
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);

    await cart.save();
    await cart.populate("items.course");

    return Response.json({ message: "دوره از سبد خرید حذف شد", cart });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
