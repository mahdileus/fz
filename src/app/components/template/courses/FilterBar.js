"use client";

import { useState, useEffect } from "react";

const filters = [
  { label: "همه", value: "" },
  { label: "ارزان‌ترین", value: "cheap" },
  { label: "گران‌ترین", value: "expensive" },
  { label: "پرمخاطب‌ترین", value: "popular" },
];

export default function FilterBar({ selected, onChange }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={() => setShowOptions((prev) => !prev)}
          className="w-full bg-primary text-white py-2 rounded-xl text-sm mb-4"
        >
          {showOptions ? "بستن مرتب‌سازی" : "مرتب‌سازی دوره‌ها"}
        </button>

        {showOptions && (
          <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-md py-3 px-4 flex flex-col gap-3">
            {filters.map((filter) => {
              const isActive = selected === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => onChange(filter.value)}
                  className={`w-full text-center px-4 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-primary font-semibold bg-light-blue"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-md py-3 px-4 flex flex-wrap md:flex-nowrap justify-center overflow-x-auto gap-4">
      {filters.map((filter) => {
        const isActive = selected === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`relative px-4 py-1.5 rounded-lg transition-all duration-200 ${
              isActive
                ? "text-primary font-semibold bg-light-blue"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
          >
            {filter.label}
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
