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
