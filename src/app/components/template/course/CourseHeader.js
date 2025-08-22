"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import { CartContext } from "@/app/context/CartContext";

export default function CourseHeader({ course = {}, isRegistered = false }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const discount = course?.discountPercent || 0;
  const price = course?.price || 0;
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  const { addToCart, cartItems = [] } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (!course || !course._id || !course.price) {
      setError(true);
    }
    setLoading(false);
  }, [course]);

  const handleAddToCart = () => {
    if (isRegistered) return;

    if (!course._id || !course.price) {
      swal({
        title: "خطا",
        text: "اطلاعات دوره معتبر نیست",
        icon: "error",
        buttons: "فهمیدم",
      });
      return;
    }

    const exists = cartItems.find((item) => item._id === course._id);

    if (exists) {
      swal({
        title: "این دوره قبلاً به سبد خرید اضافه شده است",
        icon: "info",
        timer: 2000,
        buttons: false,
      });
      return;
    }

    addToCart({
      ...course,
      price: discountedPrice, // قیمت تخفیف‌خورده
      originalPrice: price, // قیمت اصلی
    });

    swal({
      title: "دوره به سبد خرید اضافه شد",
      icon: "success",
      timer: 1500,
      buttons: false,
    }).then(() => {
      router.push("/cart");
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="w-full h-64 bg-gray-200 rounded-xl"></div>
          <div className="w-full h-6 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !course?._id) {
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        اطلاعات دوره پیدا نشد.
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <video
          controls
          className="w-full h-full object-cover rounded-xl"
          poster={course.thumbnail}
        >
          <source src={course.introVideo} />
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
      </div>

      <div className="flex flex-col justify-between bg-white rounded-xl shadow-lg p-6 space-y-6 border border-[#DBE2EF]">
        <div>
          <h1 className="text-2xl text-center font-bold text-primary leading-9 py-5">
            {course.title || "عنوان دوره"}
          </h1>
          <p className="text-base text-gray-700 text-justify text-align-last-center">
            {course.shortDescription || "توضیحاتی برای این دوره موجود نیست."}
          </p>
        </div>

        <div className="text-center space-y-3">
          {!isRegistered ? (
            <>
              <div className="flex flex-col items-center gap-1 text-sm text-primary">
                {discount > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white bg-secondery px-2 py-0.5 rounded-full">
                        {discount}٪
                      </span>
                      <span className="line-through text-gray-400 text-base">
                        {price.toLocaleString()} تومان
                      </span>
                    </div>
                    <span className="font-bold text-2xl">
                      {discountedPrice.toLocaleString()} تومان
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold">
                    {price.toLocaleString()} تومان
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-3 rounded-xl text-lg hover:bg-secondery transition"
              >
                ثبت‌نام و شروع دوره
              </button>
            </>
          ) : (
            <div className="text-primary font-semibold text-lg">
              شما در این دوره ثبت‌نام کرده‌اید
            </div>
          )}
        </div>
      </div>
    </section>
  );
}