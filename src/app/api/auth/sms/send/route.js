const request = require("request");
import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";

export async function POST(req) {
    connectToDB();
    const body = await req.json();
    const { phone } = body;

    const now = new Date();
    const expTime = now.getTime() + 300_000; // 5 Mins

    const code = Math.floor(Math.random() * 99999);

    const isUserExist = await UserModel.findOne({
        $or: [{ phone }],
    });

    if (isUserExist) {
        return Response.json(
            {
                message: "The username or email or phone exist already !!",
            },
            {
                status: 422,
            }
        );
    }

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
                //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE

                await OtpModel.create({
                    phone,
                    code,
                    expTime,
                });
                console.log(response.body);
            } else {
                console.log(error);
            }
        }
    );

    return Response.json(
        { message: "Code sent successfully :))" },
        { status: 201 }
    );
}
