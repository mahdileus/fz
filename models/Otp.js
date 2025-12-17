const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
    },

    code: {
      type: String, // هش شده ذخیره کن
      required: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    blockedUntil: {
      type: Date,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 120, // حذف خودکار بعد ۲ دقیقه
    },
  }
);
export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
