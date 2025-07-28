"use client";

import { useState } from "react";
import FilterBar from "./FilterBar";
import CoursesSidebar from "./CoursesSidebar";
import CourseCard from "../../modules/courses/CourseCard";

export default function Courses({ courses }) {
  const [sortFilter, setSortFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const allTags = Array.from(new Set(courses.flatMap((p) => p.tags || [])));
  const allCategories = Array.from(new Set(courses.map((p) => p.category).filter(Boolean)));

  const sortCourses = (filteredCourses) => {
    switch (sortFilter) {
      case "cheap":
        return [...filteredCourses].sort((a, b) => a.price - b.price);
      case "expensive":
        return [...filteredCourses].sort((a, b) => b.price - a.price);
      case "popular":
        return [...filteredCourses].sort((a, b) => (b.students || 0) - (a.students || 0));
      default:
        return filteredCourses;
    }
  };

  const filterCourses = () => {
    return courses.filter((course) => {
      const searchOk = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const tagOk = selectedTag ? (course.tags || []).includes(selectedTag) : true;
      const catOk = selectedCategory ? course.category === selectedCategory : true;
      return searchOk && tagOk && catOk;
    });
  };

  return (
    <section className="w-full py-10">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-2 w-full px-6 lg:px-0">
            <CoursesSidebar
              tags={allTags}
              categories={allCategories}
              selectedTag={selectedTag}
              selectedCategory={selectedCategory}
              onSearch={setSearchQuery}
              onSelectTag={setSelectedTag}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-8 space-y-6 w-full px-6 lg:px-0">
            <FilterBar selected={sortFilter} onChange={setSortFilter} />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-9 px-6">
              {sortCourses(filterCourses()).map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
