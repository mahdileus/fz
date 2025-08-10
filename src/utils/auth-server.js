import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import UserModel from "@/models/User";
import connectToDB from "@/configs/db";

const hashPassword = async (password) => {
  return await hash(password, 12);
};

const verifyPassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};

const generateAccessToken = (data) => {
  return sign({ ...data }, process.env.AccessTokenSecretKey, {
    expiresIn: "60d",
  });
};

const verifyAccessToken = (token) => {
  try {
    return verify(token, process.env.AccessTokenSecretKey);
  } catch (err) {
    console.log("Verify Access Token Error ->", err);
    return false;
  }
};

const generateRefreshToken = (data) => {
  return sign({ ...data }, process.env.RefreshTokenSecretKey, {
    expiresIn: "15d",
  });
};

const authUser = async () => {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return null;
    const tokenPayload = verifyAccessToken(token.value);
    if (!tokenPayload) return null;
    const user = await UserModel.findOne({ phone: tokenPayload.phone });
    return user;
  } catch (error) {
    console.error("authUser error:", error);
    return null;
  }
};

const authAdmin = async () => {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return null;
    const tokenPayload = verifyAccessToken(token.value);
    if (!tokenPayload) return null;
    const user = await UserModel.findOne({ phone: tokenPayload.phone });
    if (user?.role === "ADMIN") {
      return user;
    }
    return null;
  } catch (error) {
    console.error("authAdmin error:", error);
    return null;
  }
};

export {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  authUser,
  authAdmin,
};
