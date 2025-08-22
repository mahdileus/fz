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
},
  {
    timestamps: true,
  });

const Podcast = mongoose.models.Podcast || mongoose.model("Podcast", podcastSchema);

module.exports = Podcast;