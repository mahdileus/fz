"use client";
import { useState, } from "react";
import { authTypes } from "@/utils/constants";
import Login from "@/app/components/template/login-register/Login";
import Register from "@/app/components/template/login-register/Register";

const login_register = () => {
  const [authType, setAuthType] = useState(authTypes.LOGIN);



  const showRegisterForm = () => setAuthType(authTypes.REGISTER);
  const showloginForm = () => setAuthType(authTypes.LOGIN);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0f4f8] overflow-hidden">
      {/* Right Side - Info */}
      <div className="md:w-1/2 bg-primary text-white flex items-center justify-center px-6 py-12 z-10">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">خوش آمدید!</h2>
          <p className="text-lg">
            با ورود به حساب کاربری خود می‌توانید به تمامی امکانات دسترسی پیدا کنید.
          </p>
        </div>
      </div>

      {authType === authTypes.LOGIN ? (
        <Login showRegisterForm={showRegisterForm} />
      ) : (
        <Register showloginForm={showloginForm} />
      )}
    </div>
  );
};

export default login_register;
