const mongoose = require("mongoose");
require("./Comment");


const schema = new mongoose.Schema({
  name: {
    type: String,
    default:"کاربر سایت"
  },
    email: {
    type: String,
    required: false,
  },
    phone: {
    type: String,
    required: true,
  },
    password: {
    type:String,
    required: false,
  },
    role: {
    type: String,
    default: "USER",
  },
    comments: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Comment",
        },
      ],
    },
},
  {
    timestamps: true,
  });

const model = mongoose.models.User || mongoose.model("User", schema);

module.exports = model;
