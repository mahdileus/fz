const mongoose = require("mongoose");
require('./User')
require('./Course')



const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courses: [ // به صورت آرایه
    {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentGateway: { type: String }, // مثلا zarinpal, idpay
  authority: { type: String }, // کد مرجع بانک
  refId: { type: String }, // کد پیگیری بانک
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;