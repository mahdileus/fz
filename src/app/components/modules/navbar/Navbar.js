"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CiUser,
  CiShoppingCart,
  CiHeart,
  CiSearch,
} from "react-icons/ci";
import { PiPhone } from "react-icons/pi";

import Nav from "./Nav";
import Shape from "../../template/index/shapes/Shape";
import MobileHeader from "./MobileHeader";

export default function Navbar({ isLogin }) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="relative w-full container">
      {/* شکل پس‌زمینه */}
      <Shape />

      {/* محتویات هدر */}
      <div className="pt-3 relative z-10">
        {/* دسکتاپ */}
        <div className="hidden md:flex justify-between items-center gap-3">
          {/* سمت راست */}
          <div className="flex justify-between w-[90%] bg-gray-0/0 bg-clip-padding shadow-md backdrop-filter backdrop-blur-sm rounded-2xl px-8 py-10">
            {/* نام برند */}
            <div>
              <h2 className="font-kalameh text-xl lg:text-2xl font-bold text-primary">
                فیروزه جواهریان
              </h2>
            </div>

            {/* شماره تماس + ورود */}
            <div className="flex justify-between items-center gap-5">
              <span className="flex justify-between items-center gap-2.5">
                <p className="text-secondery font-dana lg:text-lg text-base">
                  09925349731
                </p>
                <PiPhone className="text-xl lg:text-2xl text-primary" />
              </span>
              {!isLogin ? (
                <Link
                  href="/login-register"
                  className="text-primary border border-primary font-light text-lg bg-light-blue p-2.5 rounded-2xl hidden md:flex justify-between items-center"
                >
                  <CiUser className="text-primary" />
                  <p className="text-sm font-dana font-light lg:text-base">
                    ورود / ثبت‌نام
                  </p>
                </Link>
              ) : (<Link
                href="/p-user/dashboard"
                className="text-primary border border-primary font-light text-lg bg-light-blue p-2.5 rounded-2xl hidden md:flex justify-between items-center"
              >
                <CiUser className="text-primary" />
                <p className="text-sm font-dana font-light lg:text-base">
                  حساب کاربری
                </p>
              </Link>)}
            </div>
          </div>

          {/* سمت چپ آیکون‌ها */}
          <div className="w-[10%] relative">
            <div className="flex flex-col gap-y-1.5 justify-evenly items-center">
              {/* علاقه‌مندی‌ها */}
              <div className="bg-light-blue text-xl lg:text-2xl text-red-500 p-2.5 lg:p-3 cursor-pointer rounded-xl">
                <Link href={"/p-user/wishlist"}><CiHeart  /></Link>
                
              </div>

              {/* سبد خرید */}
              <div className="bg-light-blue text-xl lg:text-2xl text-primary p-2.5 lg:p-3 cursor-pointer rounded-xl">
                <CiShoppingCart />
              </div>

              {/* آیکون سرچ با input */}
              <div className="relative">
                <div
                  onClick={() => setShowSearch((prev) => !prev)}
                  onTouchStart={() => setShowSearch((prev) => !prev)}
                  className="bg-light-blue text-xl lg:text-2xl text-primary p-2.5 lg:p-3 cursor-pointer rounded-xl"
                >
                  <CiSearch />
                </div>

                {/* باکس سرچ شناور کنار آیکون */}
                {showSearch && (
                  <div className="absolute left-0 top-full mt-2 bg-white border border-light-blue rounded-xl shadow-lg p-2 w-52 z-50">
                    <input
                      type="text"
                      placeholder="جستجو..."
                      className="w-full px-3 py-1.5 rounded-lg border border-light-blue text-sm text-primary font-dana focus:outline-none focus:ring-1 focus:ring-secondery"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ناوبری اصلی */}
        <Nav />
      </div>

      {/* موبایل */}
      <div>
        <MobileHeader isLogin={isLogin} />
      </div>
    </div>
  );
}
