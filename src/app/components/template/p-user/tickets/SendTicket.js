"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosSend } from "react-icons/io";
import swal from "sweetalert";

function SendTicket() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentID, setDepartmentID] = useState(-1);
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    const getDepartments = async () => {
      const res = await fetch("/api/department");
      const data = await res.json();
      
      setDepartments(data);
    };

    getDepartments();
  }, []);

  const sendTicket = async () => {
    if (!title || !body || departmentID === -1) {
      swal("لطفاً تمام فیلدها را تکمیل کنید", "", "warning");
      return;
    }

    const ticket = {
      title,
      body,
      department: departmentID,
      priority,
    };

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });

    if (res.status === 201) {
      swal({
        title: "تیکت با موفقیت ثبت شد",
        icon: "success",
        buttons: "مشاهده تیکت‌ها",
      }).then(() => {
        location.replace("/p-user/tickets");
      });
    }
  };

  return (
    <main className="container bg-white mx-auto px-4 rounded-2xl shadow-md py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ارسال تیکت جدید</h1>
        <Link
          href="/p-user/tickets"
          className="text-blue-600 hover:underline text-sm"
        >
          مشاهده همه تیکت‌ها
        </Link>
      </div>

      {/* فرم انتخاب دپارتمان */}
      <div className="mb-5">
        <label className="block text-gray-700 mb-2">دپارتمان:</label>
        <select
          onChange={(e) => setDepartmentID(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value={-1}>-- انتخاب دپارتمان --</option>
          {departments.map((dep) => (
            <option key={dep._id} value={dep._id}>
              {dep.title}
            </option>
          ))}
        </select>
      </div>

      {/* عنوان تیکت */}
      <div className="mb-5">
        <label className="block text-gray-700 mb-2">عنوان تیکت:</label>
        <input
          type="text"
          placeholder="مثلاً مشکل در پرداخت"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      {/* اولویت */}
      <div className="mb-5">
        <label className="block text-gray-700 mb-2">اولویت تیکت:</label>
        <select
          onChange={(e) => setPriority(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value={1}>کم</option>
          <option value={2}>متوسط</option>
          <option value={3}>زیاد</option>
        </select>
      </div>

      {/* متن تیکت */}
      <div className="mb-5">
        <label className="block text-gray-700 mb-2">متن پیام:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="w-full border border-gray-300 rounded-lg p-3"
          placeholder="متن کامل درخواست یا مشکل خود را وارد کنید..."
        ></textarea>
      </div>

      {/* فایل آپلود (اختیاری) */}
      <div className="mb-5">
        <label className="block text-gray-700 mb-2">فایل پیوست:</label>
        <input type="file" className="mb-1" />
        <p className="text-xs text-gray-500">
          حداکثر اندازه: 6MB | فرمت‌های مجاز: jpg, png, zip, rar
        </p>
      </div>

      {/* دکمه ارسال */}
      <button
        onClick={sendTicket}
        className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
      >
        <IoIosSend size={20} />
        ارسال تیکت
      </button>
    </main>
  );
}

export default SendTicket;
