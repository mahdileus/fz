const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
  },
  expTime: {
    type: Number,
    required: true,
  },
  times: {
    type: Number,
    default: 0,
  },
  blockedUntil: {
    type: Date,
    default: null,
  },
});


const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
module.exports = Otp;
