
"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#112D4E", "#3F72AF", "#75a0f0"];

export default function WishlistChart({ wishlist }) {
  // نگاشت itemType به نام‌های فارسی
  const itemTypeMap = {
    course: "دوره‌ها",
    podcast: "پادکست‌ها",
    article: "مقاله‌ها",
  };

  // محاسبه تعداد آیتم‌ها برای هر itemType
  const data = useMemo(() => {
    // شمارش تعداد آیتم‌ها برای هر itemType
    const counts = wishlist.reduce((acc, item) => {
      const type = item.itemType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // تبدیل به فرمت مورد نیاز برای نمودار
    return Object.entries(counts).map(([type, value]) => ({
      name: itemTypeMap[type] || type, // استفاده از نام فارسی یا خود itemType اگر نگاشتی نبود
      value,
    }));
  }, [wishlist]);

  if (!data || data.length === 0) {
    return <div className="text-center text-primary">داده‌ای برای نمایش وجود ندارد</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}