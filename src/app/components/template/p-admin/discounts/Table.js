"use client";
import React, { useState } from "react";
import swal from "sweetalert";

function Table({ discounts: initialDiscounts }) {
  const [discounts, setDiscounts] = useState(initialDiscounts);

  const handleDelete = async (id) => {
    const confirm = await swal({
      title: "آیا مطمئنید؟",
      text: "این عملیات قابل بازگشت نیست!",
      icon: "warning",
      buttons: ["انصراف", "حذف"],
      dangerMode: true,
    });

    if (!confirm) return;

    try {
      const res = await fetch(`/api/discount/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        swal("حذف شد!", "کد تخفیف با موفقیت حذف شد.", "success");
        setDiscounts(discounts.filter((d) => d._id !== id));
      } else {
        swal("خطا!", "حذف انجام نشد، دوباره تلاش کنید.", "error");
      }
    } catch (error) {
      swal("خطا!", "مشکلی پیش آمد، دوباره تلاش کنید.", "error");
    }
  };

  return (
    <div className="overflow-x-auto mt-10 rounded-xl shadow-md">
      <table className="min-w-full border border-gray-200 text-sm text-center bg-white">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="py-3 px-4 border-b">شناسه</th>
            <th className="py-3 px-4 border-b">کد</th>
            <th className="py-3 px-4 border-b">درصد</th>
            <th className="py-3 px-4 border-b">حداکثر استفاده</th>
            <th className="py-3 px-4 border-b">دفعات استفاده شده</th>
            <th className="py-3 px-4 border-b">حذف</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount, index) => (
            <tr
              key={discount._id}
              className="hover:bg-gray-50 transition-all duration-200"
            >
              <td
                className={`py-2 px-4 border-b font-semibold ${
                  discount.uses === discount.maxUse
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {index + 1}
              </td>
              <td className="py-2 px-4 border-b">{discount.code}</td>
              <td className="py-2 px-4 border-b">{discount.percent}%</td>
              <td className="py-2 px-4 border-b">{discount.maxUse}</td>
              <td className="py-2 px-4 border-b">{discount.uses}</td>
              <td className="py-2 px-4 border-b">
                <button
                  type="button"
                  className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(discount._id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
