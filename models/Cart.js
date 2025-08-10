import mongoose from "mongoose";
require('./Course')
require('./User')
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true
        },
        price: { type: Number, required: true }
      }
    ],
    discount: {
      code: { type: String, default: null },
      percent: { type: Number, default: 0 }
    },
    totalPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
