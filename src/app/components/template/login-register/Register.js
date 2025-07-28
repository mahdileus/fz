"use client";

import { useState } from "react";
import Sms from "./Sms";
import { showSwal } from "@/utils/helpers";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth-client";
import Swal from "sweetalert";
import { useRouter } from "next/navigation";

const Register = ({ showloginForm }) => {
  const router = useRouter()
  const [isRegisterWithPass, setIsRegisterWithPass] = useState(false);
  const [isRegisterWithOtp, setIsRegisterWithOtp] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hideOtpForm = () => setIsRegisterWithOtp(false);

  const signUp = async () => {
    if (!name.trim()) {
      return showSwal("نام را وارد بکنید", "error", "تلاش مجدد");
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return showSwal("شماره تماس وارد شده معتبر نیست", "error", "تلاش مجدد ");
    }

    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        return showSwal("ایمیل وارد شده معتبر نیست", "error", "تلاش مجدد ");
      }
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return showSwal("پسورد وارد شده قابل حدس هست", "error", "تلاش مجدد ");
    }

    const user = { name, phone, email, password };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res.status === 201) {
      Swal({
        title:"ثبت نام با موفقیت انجام شد",
        icon:"success",
        buttons:"ورود به پنل کاربری"
      }).then(()=>{
        router.replace("/p-user")
      })
    } else if (res.status === 422) {
      showSwal("کاربری با این اطلاعات از قبل وجود دارد", "error", "تلاش مجدد");
    }
  };

  const sendOtp = async () => {
    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return showSwal("شماره تماس وارد شده معتبر نیست", "error", "تلاش مجدد ");
    }

    const res = await fetch("/api/auth/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    if (res.status === 201) {
      const swal = (await import("sweetalert")).default;
      swal({
        title: "کد تایید ارسال شد",
        icon: "success",
        buttons: "ادامه",
      }).then(() => setIsRegisterWithOtp(true));
    } else if (res.status === 422) {
      const swal = (await import("sweetalert")).default;
      swal({
        title: "این شماره قبلاً ثبت‌نام شده است",
        icon: "error",
        buttons: "رفتن به ورود",
      }).then(() => showloginForm());
    } else {
      showSwal("ارسال کد با خطا مواجه شد", "error", "تلاش مجدد");
    }
  };

  return (
    <>
      {isRegisterWithOtp ? (
        <Sms hideOtpForm={hideOtpForm} phone={phone} />
      ) : (
        <div className="md:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
          <div className="w-full relative max-w-md bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/40 z-30">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondery rounded-full animate-pulse -z-10 opacity-30"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary rounded-full animate-pulse -z-10 opacity-30"></div>

            <p className="text-2xl font-kalameh font-bold text-center py-1 block text-primary">ثبت نام</p>
            <form className="space-y-4">
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-[#3F72AF]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="نام"
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-[#3F72AF]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                placeholder="شماره موبایل"
              />
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-[#3F72AF]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="ایمیل (دلخواه)"
              />

              {isRegisterWithPass && (
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-[#3F72AF]"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور"
                />
              )}

              <p
                className="w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-secondery transition duration-200 cursor-pointer"
                onClick={sendOtp}
              >
                ثبت نام با کد تایید
              </p>

              <button
                type="button"
                className="w-full border border-primary text-primary py-2 rounded-lg hover:bg-[#3F72AF]/10 transition duration-200"
                onClick={() => {
                  if (isRegisterWithPass) {
                    signUp();
                  } else {
                    setIsRegisterWithPass(true);
                  }
                }}
              >
                ثبت نام با رمزعبور
              </button>

              <p
                className="text-sm text-center py-1 block text-secondery hover:underline cursor-pointer"
                onClick={showloginForm}
              >
                برگشت به ورود
              </p>
            </form>

            <p className="text-sm text-center py-1 block text-secondery hover:underline cursor-pointer">لغو</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
