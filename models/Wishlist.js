import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemType: {
      type: String,
      enum: ["course", "podcast", "article"],
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ user: 1, item: 1, itemType: 1 }, { unique: true });


export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);
