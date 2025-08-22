"use client";

import { useState, useRef, useEffect } from "react";
import { showSwal } from "@/utils/helpers";
import swal from "sweetalert";
import { useRouter } from "next/navigation";

const Sms = ({ hideOtpForm, phone, mode = "register" }) => {
  const inputsRef = useRef([]);
  const router = useRouter();
  const [codeArray, setCodeArray] = useState(["", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(120); // زمان اولیه ۱۲۰ ثانیه
  const [resendCount, setResendCount] = useState(0); // تعداد دفعات ارسال مجدد
  const [isResendDisabled, setIsResendDisabled] = useState(true); // غیرفعال بودن ارسال مجدد

  // تابع برای شروع یا ریست تایمر
  const startTimer = (duration) => {
    setResendTimer(duration);
    setIsResendDisabled(true);
  };

  // مدیریت تایمر
  useEffect(() => {
    if (resendTimer <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setIsResendDisabled(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // پاکسازی تایمر
  }, [resendTimer]);

  // فرمت کردن زمان به دقیقه:ثانیه
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ارسال مجدد کد
  const handleResendCode = async () => {
    if (!phone || !/^09\d{9}$/.test(phone)) {
      return showSwal("شماره موبایل وارد شده معتبر نیست", "error", "تلاش مجدد");
    }

    try {
      const res = await fetch("/api/auth/sms/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, mode }),
      });

      const data = await res.json();

      if (res.status === 201) {
        swal({
          title: "کد جدید ارسال شد",
          icon: "success",
          buttons: "تأیید",
        });
        const newResendCount = resendCount + 1;
        setResendCount(newResendCount);
        startTimer(120 + newResendCount * 60);
        setCodeArray(["", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      } else if (res.status === 404) {
        showSwal("کاربری با این شماره پیدا نشد", "error", "تلاش مجدد");
      } else if (res.status === 429) {
        showSwal("تعداد درخواست‌های شما بیش از حد مجاز است", "error", "تلاش مجدد");
      } else {
        showSwal(data.message || "خطا در ارسال کد", "error", "تلاش مجدد");
      }
    } catch {
      showSwal("خطا در ارتباط با سرور", "error", "تلاش مجدد");
    }
  };

  const verifyCode = async () => {
    const code = codeArray.join("");

    if (!phone || !/^09\d{9}$/.test(phone)) {
      return showSwal("شماره موبایل وارد شده معتبر نیست", "error", "تلاش مجدد");
    }

    if (!code || !/^\d{5}$/.test(code)) {
      return showSwal("کد تأیید باید یک عدد ۵ رقمی باشد", "error", "تلاش مجدد");
    }

    const apiUrl = mode === "login" ? "/api/auth/sms/verify/login" : "/api/auth/sms/verify";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });

    if (res.status === 409) {
      return showSwal("کد وارد شده معتبر نیست", "error", "تلاش مجدد");
    } else if (res.status === 410) {
      return showSwal("کد وارد شده منقضی شده", "error", "تلاش مجدد");
    } else if (res.status === 200) {
      const data = await res.json();

      const successMsg = mode === "login" ? "ورود با موفقیت انجام شد" : "ثبت‌نام شما با موفقیت انجام شد";
      swal({
        title: successMsg,
        icon: "success",
        buttons: "ورود به پنل کاربری",
      }).then(() => {
        if (mode === "login") {
          if (data.role === "ADMIN") {
            router.replace("/p-admin");
          } else {
            router.replace("/p-user");
          }
        } else {
          router.replace("/p-user");
        }
      });
    }
  };

  const handleInputChange = (index, e) => {
    const val = e.target.value;

    if (/^\d$/.test(val)) {
      const newCode = [...codeArray];
      newCode[index] = val;
      setCodeArray(newCode);

      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      const newCode = [...codeArray];
      newCode[index] = "";
      setCodeArray(newCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="md:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
      <div className="w-full relative max-w-md bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/40 z-30">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondery rounded-full animate-pulse -z-10 opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary rounded-full animate-pulse -z-10 opacity-30"></div>

        <p className="text-2xl font-kalameh font-bold text-center text-primary">کد تایید</p>
        <span className="text-sm text-center block text-secondery mt-2">لطفاً کد تأیید ارسال شده را وارد کنید</span>
        <span className="text-xl text-center block text-primary mt-1">{phone}</span>

        <form className="space-y-4 mt-6">
          <div className="flex justify-center gap-2" dir="ltr">
            {Array.from({ length: 5 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={codeArray[i]}
                onChange={(e) => handleInputChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:border-primary"
              />
            ))}
          </div>

          <button
            onClick={verifyCode}
            type="button"
            className="w-full border border-primary text-primary py-2 rounded-lg hover:bg-[#3F72AF]/10 transition duration-200 cursor-pointer"
          >
            ثبت کد تایید
          </button>

          <p
            onClick={isResendDisabled ? null : handleResendCode}
            className={`text-md text-center ${isResendDisabled ? "text-gray-400 cursor-not-allowed" : "text-primary cursor-pointer hover:underline"}`}
          >
            {isResendDisabled
              ? `ارسال مجدد کد بعد از ${formatTime(resendTimer)}`
              : "ارسال مجدد کد یکبار مصرف"}
          </p>
          <p onClick={hideOtpForm} className="text-sm text-center text-secondery hover:underline cursor-pointer">
            لغو
          </p>
        </form>
      </div>
    </div>
  );
};

export default Sms;