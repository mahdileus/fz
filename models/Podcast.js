const mongoose = require("mongoose");
require("./Comment");

const podcastSchema = new mongoose.Schema({
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
  duration: {
    type: Number,
    required: true,
  },
  longDescription: {
    type: String,
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
  podcast: {
    type: String,
    required: true,
  },
  comments: [{
    type: mongoose.Types.ObjectId,
    ref: "Comment",
  }],
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
},
  {
    timestamps: true,
  });

const Podcast = mongoose.models.Podcast || mongoose.model("Podcast", podcastSchema);

module.exports = Podcast;