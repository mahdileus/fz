"use client";
import { useState, useEffect } from "react";

export default function CoursesSidebar({
  tags = [],
  categories = [],
  onSearch,
  onSelectTag,
  onSelectCategory,
  selectedTag,
  selectedCategory,
}) {
  const [searchText, setSearchText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (searchText.trim().length >= 3 || searchText.trim() === "") {
      const delay = setTimeout(() => {
        onSearch(searchText.trim());
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [searchText]);

  return (
    <div className="w-full">
      {isMobile && (
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="w-full bg-primary text-white py-2 rounded-xl text-sm mb-4"
        >
          {showFilters ? "بستن فیلترها" : "نمایش فیلترها"}
        </button>
      )}

      {(!isMobile || showFilters) && (
        <aside className="w-full bg-white border border-gray-100 rounded-2xl shadow-md p-4 flex flex-col gap-6">
          {/* 🔍 سرچ باکس */}
          <div className="w-full">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="جستجوی دوره..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchText.length > 0 && searchText.length < 3 && (
              <p className="text-xs text-gray-400 mt-1">برای جستجو حداقل ۳ حرف وارد کنید.</p>
            )}
          </div>

          {/* دسته‌بندی‌ها */}
          <div>
            <h3 className="text-primary font-bold mb-2">دسته‌بندی</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  onClick={() => onSelectCategory("")}
                  className={`text-sm transition px-3 py-1 rounded-md text-right ${
                    selectedCategory === ""
                      ? "bg-primary text-white font-bold"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  همه
                </button>
              </li>
              {categories.map((cat, i) => (
                <li key={i}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className={`text-sm transition px-3 py-1 rounded-md text-right ${
                      selectedCategory === cat
                        ? "bg-primary text-white font-bold"
                        : "text-gray-600 hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* تگ‌ها */}
          <div>
            <h3 className="text-primary font-bold mb-2">تگ‌ها</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSelectTag("")}
                className={`text-xs px-3 py-1 rounded-full transition ${
                  selectedTag === ""
                    ? "bg-primary text-white font-bold"
                    : "bg-light-blue text-primary hover:bg-primary hover:text-white"
                }`}
              >
                همه
              </button>
              {tags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => onSelectTag(tag)}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    selectedTag === tag
                      ? "bg-primary text-white font-bold"
                      : "bg-light-blue text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
