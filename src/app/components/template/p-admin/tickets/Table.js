"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helpers";
import swal from "sweetalert";

export default function DataTable({ tickets, title }) {
  
  const router = useRouter();

  const showTicketBody = (body) => {
    showSwal(body, undefined, "بستن");
  };

  const answerToTicket = async (ticket) => {
    swal({
      title: "لطفا پاسخ مورد نظر را وارد کنید:",
      content: "input",
      buttons: "ثبت پاسخ",
    }).then(async (answerText) => {
      if (answerText) {
        const answer = {
          ...ticket,
          body: answerText,
          ticketID: ticket._id,
        };

        const res = await fetch("/api/tickets/answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answer),
        });

        if (res.status === 201) {
          swal({
            title: "پاسخ مورد نظر ثبت شد",
            icon: "success",
            buttons: "فهمیدم",
          });
        }
      }
    });
  };

  return (
    <div className="p-6 rounded-xl bg-white backdrop-blur-md shadow-xl border border-white/40">
      <h2 className="text-xl md:text-2xl text-primary font-bold mb-4 text-center">
        {title}
      </h2>

      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full border-collapse text-center rounded-xl min-w-[800px]">
          <thead className="bg-primary text-white text-sm md:text-base">
            <tr>
              <th className="px-3 py-2">شناسه</th>
              <th className="px-3 py-2">کاربر</th>
              <th className="px-3 py-2">عنوان</th>
              <th className="px-3 py-2">دپارتمان</th>
              <th className="px-3 py-2">مشاهده</th>
              <th className="px-3 py-2">پاسخ</th>
              <th className="px-3 py-2">بن</th>
            </tr>
          </thead>
          <tbody className="bg-white text-primary text-sm md:text-base">
            {tickets.map((ticket, index) => (
              <tr
                key={ticket._id}
                className="border-b border-light-blue hover:bg-cream transition"
              >
                <td className="px-3 py-2">{index + 1}</td>
                <td className="px-3 py-2">{ticket.user.name}</td>
                <td className="px-3 py-2">{ticket.title}</td>
                <td className="px-3 py-2">{ticket.department.title}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => showTicketBody(ticket.body)}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-lg"
                  >
                    مشاهده
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => answerToTicket(ticket)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    پاسخ
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    بن
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
