import connectToDB from "@/configs/db";
import Cart from "@/models/Cart";

export async function POST(req) {
    try {
        await connectToDB();
        const { userId } = await req.json();

        const cart = await Cart.findOne({ user: userId }).populate("items.course");
        if (!cart) {
            return Response.json({ items: [], totalPrice: 0, discount: { code: null, percent: 0 } }, { status: 200 });
        }


        return Response.json(cart);
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
