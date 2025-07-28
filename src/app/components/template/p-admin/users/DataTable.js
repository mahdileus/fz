"use client";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DataTable({ users, title }) {
  const router = useRouter();
  const [bannedUsers, setBannedUsers] = useState([]);

  // گرفتن لیست کاربران بن شده از سرور
  useEffect(() => {
    fetch("/api/user/ban")
      .then((res) => res.json())
      .then((data) => setBannedUsers(data.bannedPhones || []));
  }, []);

  const isUserBanned = (phone) => {
    return bannedUsers.includes(phone);
  };

  const changeRole = async (userID) => {
    if (!userID) return swal("خطا", "شناسه کاربر نامعتبر است", "error");

    const res = await fetch("/api/user/role", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userID }),
    });

    if (res.status === 200) {
      swal("موفق", "نقش کاربر تغییر یافت", "success").then(() =>
        router.refresh()
      );
    }
  };

  const removeUser = async (userID) => {
    if (!userID) return swal("خطا", "شناسه کاربر نامعتبر است", "error");

    const confirm = await swal({
      title: "حذف کاربر",
      text: "آیا از حذف کاربر اطمینان دارید؟",
      icon: "warning",
      buttons: ["لغو", "بله، حذف کن"],
      dangerMode: true,
    });

    if (confirm) {
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userID }),
      });

      if (res.status === 200) {
        swal("حذف شد", "کاربر با موفقیت حذف شد", "success").then(() =>
          router.refresh()
        );
      }
    }
  };

const banUser = async (email, phone) => {
  if (!phone) return swal("خطا", "شماره موبایل کاربر موجود نیست", "error");

  const isBanned = isUserBanned(phone);

  const confirm = await swal({
    title: isBanned ? "آزاد کردن کاربر" : "بن کردن کاربر",
    text: `آیا مطمئنید که می‌خواهید این کاربر را ${isBanned ? "آزاد" : "بن"} کنید؟`,
    icon: "warning",
    buttons: ["لغو", isBanned ? "آزاد کن" : "بن کن"],
    dangerMode: true,
  });

  if (!confirm) return;

  const res = await fetch("/api/user/ban", {
    method: isBanned ? "DELETE" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone }),
  });

  if (res.ok) {
    swal(
      isBanned ? "کاربر آزاد شد" : "کاربر بن شد",
      `کاربر با موفقیت ${isBanned ? "از بن خارج" : "بن"} شد`,
      "success"
    );

    // 👇 به‌روزرسانی state بدون نیاز به refresh
    setBannedUsers((prev) => {
      if (isBanned) {
        return prev.filter((p) => p !== phone); // حذف از لیست
      } else {
        return [...prev, phone]; // اضافه کردن به لیست
      }
    });
  }
};

  return (
    <div>
      <h2 className="text-xl md:text-2xl text-primary font-bold mb-4 text-center">{title}</h2>

      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full border-collapse text-center rounded-xl min-w-[800px]">
          <thead className="bg-primary text-white text-sm md:text-base">
            <tr>
              <th className="px-3 py-2">شناسه</th>
              <th className="px-3 py-2">نام</th>
              <th className="px-3 py-2">ایمیل</th>
              <th className="px-3 py-2">نقش</th>
              <th className="px-3 py-2">وضعیت بن</th>
              <th className="px-3 py-2">تغییر نقش</th>
              <th className="px-3 py-2">حذف</th>
              <th className="px-3 py-2">بن / آزاد</th>
            </tr>
          </thead>
          <tbody className="bg-white text-primary text-sm md:text-base">
            {users.map((user, index) => {
              const banned = isUserBanned(user.phone);
              return (
                <tr
                  key={user._id}
                  className="border-b border-light-blue hover:bg-cream transition"
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{user.name}</td>
                  <td dir="ltr" className="px-3 py-2">{user.email || "ایمیل ثبت نشده"}</td>
                  <td className="px-3 py-2">
                    {user.role === "USER" ? "کاربر عادی" : "مدیر"}
                  </td>
                  <td className="px-3 py-2">
                    {banned ? (
                      <FaTimes className="text-red-500 inline-block" title="بن شده" />
                    ) : (
                      <FaCheck className="text-green-500 inline-block" title="فعال" />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => changeRole(user._id)}
                      className="bg-light-blue hover:bg-light-blue/60 cursor-pointer text-primary px-3 py-1 rounded-lg"
                    >
                      تغییر نقش
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => removeUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded-lg"
                    >
                      حذف
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => banUser(user.email, user.phone)}
                      className="bg-primary hover:bg-primary/90 cursor-pointer text-cream px-3 py-1 rounded-lg"
                    >
                      {banned ? "آزاد کردن" : "بن"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
