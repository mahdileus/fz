import React from "react";
import { CiTrash } from "react-icons/ci";
export default function CourseItem({ course, onRemove }) {
  return (
    <li
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-light-blue rounded-md
        hover:shadow-md transition-shadow duration-300 bg-white"
    >
      <img
        src={course.thumbnail || "/default-course.jpg"}
        alt={course.title}
        className="w-full sm:w-40 h-24 object-cover rounded-md flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-xl text-primary">{course.title}</h3>
        <p className="mt-1 text-secondery text-sm sm:text-base line-clamp-2">{course.shortDescription}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="text-lg font-medium">
          {course.discountedPrice ? (
            <>
              <span className="line-through text-gray-400 ml-2">{course.price.toLocaleString()} تومان</span>
              <span className="text-primary">{course.discountedPrice.toLocaleString()} تومان</span>
            </>
          ) : (
            <span className="text-primary">{course.price.toLocaleString()} تومان</span>
          )}
        </p>
        <button
          onClick={() => onRemove(course._id)}
          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-300"
        >
          <CiTrash className="text-xl"/>
        </button>
      </div>
    </li>
  );
}
