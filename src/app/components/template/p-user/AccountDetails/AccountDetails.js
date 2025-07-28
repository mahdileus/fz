"use client";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";

function AccountDetails() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
    };
    getUser();
  }, []);

  const updateUser = async () => {
    const userNewInfos = { name, email, phone };

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userNewInfos),
    });

    if (res.status === 200) {
      swal({
        title: "اطلاعات با موفقیت بروزرسانی شد",
        icon: "success",
        buttons: "باشه",
      }).then(async () => {
        await fetch("/api/auth/signout", { method: "POST" });
        location.replace("/login-register");
      });
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-right border-b pb-4">
        <span>جزئیات اکانت</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* فرم اطلاعات کاربری */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-right">نام کاربری</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام کاربری"
              type="text"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-right">ایمیل</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل"
              type="text"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-right">شماره تماس</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="شماره تماس"
              type="text"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* عکس و رمز */}
        <section className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/images/shahin.jpg"
              alt="user"
              className="w-32 h-32 rounded-full border shadow"
            />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:underline">
                <IoCloudUploadOutline />
                تغییر تصویر
                <input type="file" className="hidden" />
              </label>
              <button className="text-red-500 hover:underline flex items-center gap-1 text-sm">
                <MdOutlineDelete />
                حذف
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-right">رمز عبور</label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="رمز جدید"
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-white px-4 py-2 rounded">
                تغییر رمز
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="text-right">
        <button
          onClick={updateUser}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          ثبت تغییرات
        </button>
      </div>
    </main>
  );
}

export default AccountDetails;
