"use client";
import React from "react";
import Link from "next/link";
import Ticket from "./Ticket";

function Tickets({ tickets }) {
  return (
    <main className="p-4 sm:p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">همه تیکت‌ها</h1>
        <Link
          href="/p-user/tickets/sendticket"
          className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-primary/90 transition"
        >
          ارسال تیکت جدید
        </Link>
      </div>

      {/* Filters Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>همه</option>
            <option>فرستاده شده</option>
            <option>دریافتی</option>
          </select>
          <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>همه</option>
            <option>باز</option>
            <option>بسته</option>
            <option>پاسخ داده شده</option>
            <option>پایان یافته</option>
          </select>
          <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>تاریخ پاسخ</option>
            <option>تاریخ ایجاد</option>
          </select>
          <button
            type="submit"
            className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary/90 transition w-full"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Ticket key={ticket._id} {...ticket} />
        ))}
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <div className="text-center mt-10 text-gray-600">
          <p className="text-lg">تیکتی وجود ندارد</p>
        </div>
      )}
    </main>
  );
}

export default Tickets;
