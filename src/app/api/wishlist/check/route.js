import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import mongoose from "mongoose";
import Wishlist from "@/models/Wishlist";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDB();
  const user = await authUser();
  if (!user) return NextResponse.json({ liked: false }, { status: 200 });

  const { searchParams } = new URL(req.url);
  const item = searchParams.get("item");
  const itemType = searchParams.get("type");

  if (!item || !itemType) {
    return NextResponse.json({ liked: false }, { status: 400 });
  }

  const objectItemID = new mongoose.Types.ObjectId(item); // 👈 این اضافه شود

  const exists = await Wishlist.exists({
    user: user._id,
    item: objectItemID,
    itemType,
  });

  return NextResponse.json({ liked: !!exists }, { status: 200 });
}
