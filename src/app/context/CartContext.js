"use client";

import React, { createContext, useState, useEffect } from "react";

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
      setCartItems([...cartItems, course]);
    }
  };

  // حذف دوره از سبد
  const removeFromCart = (courseId) => {
    setCartItems(cartItems.filter((item) => item._id !== courseId));
  };

  // محاسبه مجموع قیمت
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.discountedPrice || item.price), 0);

  // محاسبه قیمت بعد از تخفیف
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
