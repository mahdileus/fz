"use client";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { IoIosHeart } from "react-icons/io";
import { showSwal } from "@/utils/helpers";
import { useRouter } from "next/navigation";

export default function LikeButton({ itemID, itemType }) {  
  const router = useRouter()
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/auth/me", { credentials: "include" });
        const userData = await userRes.json();
        if (userRes.ok && userData?._id) {
          setUser(userData);
          const res = await fetch(`/api/wishlist/check?item=${itemID}&type=${itemType}`);
          const data = await res.json();
          setLiked(data.liked);
        } 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemID, itemType]);

  const toggleLike = async () => {    
    if (loading) return;
    if (!user?._id) {
      return showSwal(
        "برای افزودن به علاقه‌مندی‌ها لطفاً وارد شوید",
        "error",
        "ورود به حساب",
        () => {
          router.replace = ("/login-register");
        }
      );
    }

    const payload = { item: itemID, itemType };

    try {
      const res = await fetch("/api/wishlist", {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setLiked(!liked);
        showSwal(
          liked ? "با موفقیت از علاقه‌مندی‌ها حذف شد!" : "به علاقه‌مندی‌ها اضافه شد ",
          "success",
          "بستن"
        );
      } else if (data.message === "آیتم تکراری می باشد") {
        setLiked(true);
        showSwal("این آیتم قبلاً در علاقه‌مندی‌ها اضافه شده است", "info", "باشه");
      } else {
        showSwal(data.message || "مشکلی در عملیات پیش آمد", "error", "باشه");
      }
    } catch (err) {
      showSwal("خطای شبکه یا سرور!", "error", "متوجه شدم");
    }
  };

  if (loading) return <div className="text-gray-500">در حال بارگذاری...</div>;

  return (
    <button onClick={toggleLike} className="transition duration-300 group" disabled={loading}>
      {liked ? (
        <IoIosHeart size={24} className="text-red-500 transition duration-300" />
      ) : (
        <>
          <CiHeart size={24} className="text-red-500 group-hover:hidden" />
          <IoIosHeart size={24} className="hidden group-hover:inline text-red-400" />
        </>
      )}
    </button>
  );
}