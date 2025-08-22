"use client";

import { useContext, useState, useEffect } from "react";
import swal from "sweetalert";
import CourseItem from "./CourseItem";
import { CartContext } from "@/app/context/CartContext";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    discountCode,
    setDiscountCode,
    discountPercent,
    setDiscountPercent,
    totalPrice,
    discountedPrice,
  } = useContext(CartContext);

  

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (res.ok && data._id) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  const applyDiscount = async () => {
    if (!user) {
      return swal("ابتدا وارد شوید", "", "warning");
    }
    if (!discountCode.trim()) {
      return swal("لطفاً کد تخفیف را وارد کنید", "", "warning");
    }

    try {
      const res = await fetch("/api/cart/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          code: discountCode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDiscountPercent(data.cart.discount.percent);
        swal("کد تخفیف اعمال شد", "", "success");
      } else {
        setDiscountPercent(0);
        swal(data.message || "خطا در اعمال کد تخفیف", "", "error");
      }
    } catch {
      swal("خطا در ارتباط با سرور", "", "error");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      return swal("ابتدا وارد شوید", "", "warning");
    }
    if (cartItems.length === 0) {
      return swal("سبد خرید شما خالی است", "", "warning");
    }

    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          items: cartItems.map((item) => ({
            _id: item._id,
            price: item.price, // فقط قیمت تخفیف‌خورده
          })),
          discountCode: discountCode || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        swal(data.error || "خطا در شروع پرداخت", "", "error");
      }
    } catch {
      swal("خطا در ارتباط با سرور", "", "error");
    }
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-primary text-lg">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10 rounded-lg shadow-lg mt-30 text-primary min-h-[70vh]">
      <h2 className="text-xl font-extrabold mb-8 text-right">سبد خرید شما</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-lg mt-12 text-secondery">سبد خرید شما خالی است</p>
      ) : (
        <>
          <ul className="space-y-6">
            {cartItems.map((course, index) => (
              <CourseItem key={index} course={course} onRemove={removeFromCart} />
            ))}
          </ul>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="کد تخفیف خود را وارد کنید"
              className="flex-grow p-3 rounded border border-light-blue focus:outline-none focus:ring-2 focus:ring-secondery text-primary"
            />
            <button
              onClick={applyDiscount}
              className="bg-secondery text-white font-semibold px-6 py-3 rounded shadow-md hover:bg-primary transition-colors duration-300 w-full sm:w-auto"
            >
              اعمال کد تخفیف
            </button>
          </div>

          <div className="flex items-center justify-between mt-10 text-right space-y-2 border-t border-light-blue pt-6 text-primary">
            <p className="text-lg">
              جمع کل: <span className="font-bold">{totalPrice.toLocaleString()} تومان</span>
            </p>
            <p className="text-xl text-secondery">
              پس از تخفیف: <span className="font-bold">{discountedPrice.toLocaleString()} تومان</span>
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-8 w-full bg-primary text-cream font-bold py-4 rounded-lg shadow-lg hover:bg-secondery transition-colors duration-300 cursor-pointer"
          >
            پرداخت
          </button>
        </>
      )}
    </div>
  );
}