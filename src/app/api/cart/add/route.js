import connectToDB from "@/configs/db";
import Cart from "@/models/Cart";
import Course from "@/models/Course";

export async function POST(req) {
    try {
        await connectToDB();
        const { userId, courseId } = await req.json();

        const course = await Course.findById(courseId);
        if (!course) {
            return Response.json({ message: "دوره یافت نشد" }, { status: 404 });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ course: course._id, price: course.discountedPrice || course.price }],
                totalPrice: course.discountedPrice || course.price
            });
        } else {
            const exists = cart.items.some(item => item.course.equals(course._id));
            if (exists) {
                return Response.json({ message: "این دوره قبلاً در سبد خرید هست" }, { status: 400 });
            }

            cart.items.push({ course: course._id, price: course.discountedPrice || course.price });
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);
            await cart.save();
            await cart.populate("items.course");

        }

        return Response.json({ message: "دوره به سبد خرید اضافه شد", cart });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
