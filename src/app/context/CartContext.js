"use client";

import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // بارگذاری سبد از localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      setCartItems(parsed.items || []);
      setDiscountCode(parsed.discountCode || "");
      setDiscountPercent(parsed.discountPercent || 0);
    }
  }, []);

  // ذخیره در localStorage هنگام تغییر
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify({ items: cartItems, discountCode, discountPercent })
    );
  }, [cartItems, discountCode, discountPercent]);

  // اضافه کردن دوره به سبد
const addToCart = (course) => {
  if (!cartItems.find((item) => item._id === course._id)) {
    const cartItem = {
      _id: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      shortDescription: course.shortDescription,
      price: course.price || 0,  // 👈 حتماً ست کن
      discountedPrice: course.discountedPrice || null,
    };
    setCartItems([...cartItems, cartItem]);
  }
};

 

  
  // حذف دوره از سبد
  const removeFromCart = (courseId) => {
    setCartItems(cartItems.filter((item) => item._id !== courseId));
  };

  // محاسبه مجموع قیمت (فقط از item.price استفاده می‌کنیم)
const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  // محاسبه قیمت بعد از تخفیف کد تخفیف
  const discountedPrice = Math.round(totalPrice * ((100 - discountPercent) / 100));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        discountCode,
        setDiscountCode,
        discountPercent,
        setDiscountPercent,
        totalPrice,
        discountedPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}