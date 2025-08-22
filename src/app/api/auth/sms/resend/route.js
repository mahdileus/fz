import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";
const request = require("request");

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { phone, mode } = body;

    // اعتبارسنجی شماره موبایل
    if (!phone || !/^09\d{9}$/.test(phone)) {
      return Response.json(
        { message: "شماره موبایل معتبر نیست" },
        { status: 400 }
      );
    }

    // بررسی وجود کاربر
    const isUserExist = await UserModel.findOne({ phone });
    if (!isUserExist) {
      return Response.json(
        { message: "کاربری با این شماره پیدا نشد" },
        { status: 404 }
      );
    }

    // بررسی تعداد درخواست‌های اخیر
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await OtpModel.countDocuments({
      phone,
      createdAt: { $gte: oneHourAgo },
    });
    if (recentOtps >= 5) {
      return Response.json(
        { message: "تعداد درخواست‌های شما بیش از حد مجاز است" },
        { status: 429 }
      );
    }

    // تولید کد تأیید و زمان انقضا
    const now = new Date();
    const expTime = now.getTime() + 300_000; // ۵ دقیقه
    const code = Math.floor(10000 + Math.random() * 89999); // کد ۵ رقمی

    // ارسال OTP از طریق IPPanel
    return new Promise((resolve) => {
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
        async (error, response, body) => {
          if (error) {
            console.error("Error sending OTP:", error);
            resolve(
              Response.json(
                { message: "خطا در ارتباط با سرور IPPanel" },
                { status: 500 }
              )
            );
            return;
          }

          if (response.statusCode === 200) {
            try {
              await OtpModel.create({ phone, code, expTime });
              console.log("OTP resent successfully");
              resolve(
                Response.json(
                  { message: "کد جدید ارسال شد" },
                  { status: 201 }
                )
              );
            } catch (dbError) {
              console.error("Error saving OTP to database:", dbError);
              resolve(
                Response.json(
                  { message: "خطا در ذخیره کد" },
                  { status: 500 }
                )
              );
            }
          } else {
            console.error("Error sending OTP:", body);
            resolve(
              Response.json(
                { message: "خطا در ارسال کد" },
                { status: 500 }
              )
            );
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in resend OTP:", error);
    return Response.json(
      { message: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}