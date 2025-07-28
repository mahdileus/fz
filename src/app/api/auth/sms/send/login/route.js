const request = require("request");
import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";

export async function POST(req) {
  await connectToDB();

  const body = await req.json();
  const { phone } = body;

  const now = new Date();
  const expTime = now.getTime() + 300_000; // 5 minutes

  const code = Math.floor(10000 + Math.random() * 89999); // Always 5-digit

  // Check if user exists
  const isUserExist = await UserModel.findOne({ phone });
  if (!isUserExist) {
    return Response.json(
      { message: "کاربری با این شماره پیدا نشد" },
      { status: 404 }
    );
  }

  // Send OTP using IPPanel
  request.post(
    {
      url: "http://ippanel.com/api/select",
      body: {
        op: "pattern",
        user: process.env.IPPANEL_USER,
        pass: process.env.IPPANEL_PASS,
        fromNum: "3000505",
        toNum: phone,
        patternCode: "zcrh775wl9h9gx6",
        inputData: [{ "verification-code": code }],
      },
      json: true,
    },
    async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        await OtpModel.create({ phone, code, expTime });
        console.log("OTP sent successfully");
      } else {
        console.error("Error sending OTP:", error || body);
      }
    }
  );

  return Response.json(
    { message: "کد ورود ارسال شد" },
    { status: 201 }
  );
}
