"use client";
import React, { useState } from "react";
import swal from "sweetalert";
import { useRouter } from "next/navigation";

function AddDiscount() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [maxUse, setMaxUse] = useState("");

  const addDiscount = async () => {
    if (!code || !percent || !maxUse) {
      swal({
        title: "لطفاً تمام فیلدها را پر کنید",
        icon: "warning",
        buttons: "باشه",
      });
      return;
    }

    const discount = { code, percent, maxUse };

    const res = await fetch("/api/discount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discount),
    });

    if (res.status === 201) {
      swal({
        title: "کد تخفیف با موفقیت ایجاد شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        setCode("");
        setPercent("");
        setMaxUse("");
        router.refresh();
      });
    } else {
      swal({
        title: "خطا در ایجاد کد تخفیف",
        icon: "error",
        buttons: "متوجه شدم",
      });
    }
  };

  return (
    <section className="bg-white shadow-md rounded-xl p-6 mt-10 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">افزودن کد تخفیف جدید</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            شناسه تخفیف
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="مثلاً: YALDA1403"
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            درصد تخفیف
          </label>
          <input
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            placeholder="مثلاً: 20"
            type="number"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            حداکثر استفاده
          </label>
          <input
            value={maxUse}
            onChange={(e) => setMaxUse(e.target.value)}
            placeholder="مثلاً: 50"
            type="number"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={addDiscount}
          className="bg-primary cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          افزودن
        </button>
      </div>
    </section>
  );
}

export default AddDiscount;
