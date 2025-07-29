"use client"
import Link from "next/link";
import Sms from "./Sms";
import { showSwal } from "@/utils/helpers";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert";

export default function Login({ showRegisterForm }) {
  const router = useRouter()
  const [isLoginWithOtp, setIsLoginWithOtp] = useState(false);
  const [password, setPassword] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");

  const hideOtpForm = () => setIsLoginWithOtp(false);

  const loginWithPassword = async (event) => {
    event.preventDefault();
    if (!phoneOrEmail) {
      return showSwal("لطفا شماره تماس یا ایمیل را وارد کنید", "error", "چشم");
    }

    const isValidEmail = validateEmail(phoneOrEmail);
    const isValidatePhone = validatePhone(phoneOrEmail);
    if (!isValidEmail && !isValidatePhone) {
      return showSwal("ایمیل وارد شده یا شماره همراه صحیح نیست", "error", "تلاش مجدد");
    }

    if (!password) {
      return showSwal("پسورد را وارد کنید", "error", "تلاش مجدد");
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return showSwal("پسورد یا ایمیل نادرست میباشد", "error", "تلاش مجدد");
    }

    const user = { phoneOrEmail, password };

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await res.json();

    console.log("Res ->", res);
    if (res.status === 200) {

      Swal({
        title: "با موفقیت لاگین شدین",
        icon: "success",
        buttons: "ورود به پنل کاربری",
      }).then(() => {
        if (data.role === "ADMIN") {
          router.replace("/p-admin");
        } else {
          router.replace("/p-user");
        }
      });

    } else if (res.status === 422 || res.status === 401) {
      showSwal("کاربری با این اطلاعات یافت نشد", "error", "تلاش مجدد");
    } else if (res.status === 419) {
      showSwal("ایمیل یا پسورد صحیح نیست", "error", "تلاش مجدد");
    }
  };
const handleLoginWithOtp = async () => {
  const isValidPhone = validatePhone(phoneOrEmail);
  const isValidEmail = validateEmail(phoneOrEmail);

  if (isValidEmail) {
    return showSwal("ورود با کد تایید فقط با شماره موبایل امکان‌پذیر است", "error", "متوجه شدم");
  }

  if (!isValidPhone) {
    return showSwal("شماره تماس وارد شده معتبر نیست", "error", "تلاش مجدد ");
  }

  const res = await fetch("/api/auth/sms/send/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: phoneOrEmail }), // ✅ درست ارسال شود
  });

  if (res.status === 201) {
    showSwal("کد با موفقیت ارسال شد", "success", "ادامه");
    setIsLoginWithOtp(true);
  } else if (res.status === 404) {
    showSwal("کاربری با این شماره یافت نشد", "error", "تلاش مجدد");
  } else {
    showSwal("ارسال کد با خطا مواجه شد", "error", "تلاش مجدد");
  }
};


  return (
    <>
      {!isLoginWithOtp ? (
        <>

          {/* Left Side - Glass Box Form */}
          <div className="md:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
            <div className="w-full relative max-w-md bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/40 z-30">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondery rounded-full animate-pulse -z-10 opacity-30"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary rounded-full animate-pulse -z-10 opacity-30"></div>
              <h2 className="text-2xl font-bold text-primary text-center mb-8">ورود به حساب</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="شماره موبایل یا ایمیل"
                  value={phoneOrEmail}
                  onChange={(event) => setPhoneOrEmail(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-[#3F72AF]"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="رمز عبور"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-[#3F72AF]"
                />

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondery transition duration-200"
                  onClick={loginWithPassword}
                >
                  ورود
                </button>

                <Link href={"/forget-password"} className="text-sm text-center py-1 block text-secondery hover:underline cursor-pointer">
                  رمز عبور خود را فراموش کرده‌ام
                </Link>

                <button
                  type="button"
                  className="w-full border border-primary text-primary py-2 rounded-lg hover:bg-[#3F72AF]/10 transition duration-200"
                  onClick={handleLoginWithOtp}                >
                  ورود با کد یکبار مصرف
                </button>
                <p className="text-sm text-center text-gray-700 mt-4">
                  حساب کاربری ندارید؟{" "}
                  <Link href={""} className="text-secondery hover:underline cursor-pointer" onClick={showRegisterForm}>ثبت‌نام کنید</Link>
                </p>
                <Link href={"/"} className="text-sm text-center py-1 block text-secondery hover:underline cursor-pointer">
                  لغو
                </Link>
              </form>
            </div>
          </div>

        </>
      ) :
        <Sms hideOtpForm={hideOtpForm} phone={phoneOrEmail} mode="login" />
      }
    </>
  );
}
