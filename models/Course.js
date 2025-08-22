const mongoose = require("mongoose");
require("./Comment");

// مدل جلسه (Lesson)
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: false,
  },
    audio:{
    type: String,
    required: false,
  }
});

// مدل دوره (Course)
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
    slug: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    default: null,
  },
  discountPercent: {
    type: Number,
    default: null,
  },
  category: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 5,
  },
  tags: {
    type: [String],
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  introVideo: {
    type: String,
    required: true,
  },
  comments: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  lessons: {
    type: [lessonSchema],
    default: [],
  },
},
  {
    timestamps: true,
  });

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

module.exports = Course;
