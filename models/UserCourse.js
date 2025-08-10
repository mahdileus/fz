const mongoose = require("mongoose");
require('./User')
require('./Course')
const userCourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  }
});

const UserCourse = mongoose.models.UserCourse || mongoose.model("UserCourse", userCourseSchema);
module.exports = UserCourse;
