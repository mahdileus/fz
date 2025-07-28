import connectToDB from "@/configs/db"
import UserModel from "@/models/User";
import { generateAccessToken, hashPassword } from "@/utils/auth-server";
import { roles } from "@/utils/constants";
import { validateEmail, validatePhone, validatePassword } from "@/utils/auth-client";

export async function POST(req) {
  connectToDB();
 
  try{
     const body = await req.json();
  const { name, phone, email, password } = body;
  
// Validate Name
if (!name || name.trim().length < 3) {
  return Response.json(
    { message: "نام باید حداقل ۳ کاراکتر باشد." },
    { status: 400 }
  );
}

// Validate Phone
if (!validatePhone(phone)) {
  return Response.json(
    { message: "شماره موبایل معتبر نیست." },
    { status: 400 }
  );
}

// Validate Email (only if provided)
if (email && !validateEmail(email)) {
  return Response.json(
    { message: "ایمیل وارد شده معتبر نیست." },
    { status: 400 }
  );
}

// Validate Password
if (!validatePassword(password)) {
  return Response.json(
    {
      message:
        "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد.",
    },
    { status: 400 }
  );
}

  
const conditions = [];
if (name) conditions.push({ name });
if (email) conditions.push({ email });
if (phone) conditions.push({ phone });

if (conditions.length > 0) {
  const isUserExist = await UserModel.findOne({ $or: conditions });
  if (isUserExist) {
    return Response.json(
      { message: "The username or email or phone already exists" },
      { status: 422 }
    );
  }
}


  const hashedPassword = await hashPassword(password);
  const accessToken = generateAccessToken({ phone });

  const users = await UserModel.find({});

  await UserModel.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: users.length > 0 ? roles.USER : roles.ADMIN,
  });
  

  return Response.json(
    { message: "User signed up successfully :))" },
    {
      status: 201,
      headers: { "Set-Cookie": `token=${accessToken};path=/;httpOnly=true` },
    });
  } catch (err) {
    console.log("Err ->", err);
    return Response.json(
      { message: err },
      {
        status: 500,
      }
    );
  }
}
