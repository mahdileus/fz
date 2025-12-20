const mongoose = require("mongoose");
require("./Comment");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    type: String,
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
  timeToRead: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 5,
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
  // فیلدهای سئو خفن اضافه
  metaTitle: {
    type: String,
    default: function () { return this.title; },  // default به title
  },
  metaDescription: {
    type: String,
    default: function () { return this.shortDescription; },  // default به shortDescription
  },
  metaKeywords: {
    type: [String],
    default: function () { return this.tags; },  // default به tags
  },
  canonicalUrl: {
    type: String,
    default: function () { return `/posts/${this.slug}`; },
  },
  seoSchema: {
    type: Object,  // JSON-LD برای Article schema
    default: {},
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);

module.exports = Article;