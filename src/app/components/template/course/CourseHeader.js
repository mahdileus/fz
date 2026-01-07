"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import { CartContext } from "@/app/context/CartContext";

export default function CourseHeader({ course = {}, isRegistered = false }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();
  const { addToCart, cartItems = [] } = useContext(CartContext);

  // ---------- Price Logic ----------
  const price = Number(course?.price ?? 0);
  const discount = Number(course?.discountPercent ?? 0);
  const isFree = price === 0 || course?.isFree;

  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  const formatPrice = (value) =>
    value.toLocaleString("fa-IR") + " تومان";

  // ---------- Effects ----------
  useEffect(() => {
    if (!course || !course._id) {
      setError(true);
    } else {
      setError(false);
    }
    setLoading(false);
  }, [course]);

  // ---------- Handlers ----------
  const handleAddToCart = () => {
    if (isRegistered) return; // فقط ثبت‌نام‌شده‌ها ممنوع

    if (!course?._id) {
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
      price: isFree ? 0 : discountedPrice,
      originalPrice: price,
      isFree,
    });

    swal({
      title: isFree
        ? "دوره رایگان به سبد خرید اضافه شد"
        : "دوره به سبد خرید اضافه شد",
      icon: "success",
      timer: 1500,
      buttons: false,
    }).then(() => {
      router.push("/cart");
    });
  };


  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="container mx-auto py-20">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="w-full h-64 bg-gray-200 rounded-xl" />
          <div className="w-full h-6 bg-gray-200 rounded" />
          <div className="w-1/2 h-6 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // ---------- Error ----------
  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        اطلاعات دوره پیدا نشد.
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <section className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Video */}
      <div className="lg:col-span-2 w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <video
          controls
          className="w-full h-full object-contain bg-black rounded-xl"
          poster={course.thumbnail}
        >
          <source src={course.introVideo} />
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
      </div>

      {/* Info Box */}
      <div className="flex flex-col justify-between bg-white rounded-xl shadow-lg p-6 space-y-6 border border-light-blue">
        {/* Title & Desc */}
        <div>
          <h1 className="text-2xl text-center font-bold text-primary py-4">
            {course.title}
          </h1>
          <p className="text-gray-700 text-justify text-align-last-center">
            {course.shortDescription}
          </p>
        </div>

        {/* Price */}
        {!isRegistered && (
          <div className="text-center space-y-2">

            {isFree ? (
              <div className="text-green-700  font-bold text-2xl">
                رایگان!
              </div>
            ) : discount > 0 ? (
              <>
                <div className="text-gray-400 line-through text-lg">
                  {formatPrice(price)}
                </div>
                <div className="text-primary font-bold text-2xl">
                  {formatPrice(discountedPrice)}
                </div>
              </>
            ) : (
              <div className="text-primary font-bold text-2xl">
                {formatPrice(price)}
              </div>
            )}

          </div>
        )}


        {/* Actions */}
        <div className="space-y-3 text-center">

          {!isRegistered && (
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-xl text-lg transition
        ${isFree
                  ? "bg-primary hover:bg-secondery text-white"
                  : "bg-primary hover:bg-secondery text-white"
                }`}
            >
              {isFree ? "افزودن دوره رایگان" : "ثبت‌نام و شروع دوره"}
            </button>
          )}

          {isRegistered && (
            <div className="text-primary font-semibold text-lg">
              شما در این دوره ثبت‌نام کرده‌اید
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
