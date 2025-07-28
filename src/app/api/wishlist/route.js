import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import Wishlist from "@/models/Wishlist";
import { authUser } from "@/utils/auth-server";
import mongoose from "mongoose";

export async function POST(req) {
  await connectToDB();
  const user = await authUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { itemType, item } = await req.json();
  if (!["course", "podcast", "article"].includes(itemType) || !item) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }
  const objectItemID = new mongoose.Types.ObjectId(item);

  try {
    const existingWishlist = await Wishlist.findOne({
      user: user._id,
      itemType,
      item: objectItemID,
    });

    if (existingWishlist) {
      return NextResponse.json({ message: "Item already in wishlist" }, { status: 200 });
    }

    const wishlist = await Wishlist.create({
      user: user._id,
      itemType,
      item: objectItemID,
    });
    return NextResponse.json({ message: "Added to wishlist", wishlist }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error adding to wishlist", error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectToDB();
  const user = await authUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { itemType, item } = await req.json();
  const objectItemID = new mongoose.Types.ObjectId(item);
  try {
    const deleted = await Wishlist.findOneAndDelete({
      user: user._id,
      itemType,
      item: objectItemID,
    });
    return NextResponse.json({ message: "Removed from wishlist" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error deleting", error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectToDB();
  const user = await authUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const filter = { user: user._id };
  if (type) filter.itemType = type;

  const wishlist = await Wishlist.find(filter).lean();
  return NextResponse.json({ wishlist }, { status: 200 });
}