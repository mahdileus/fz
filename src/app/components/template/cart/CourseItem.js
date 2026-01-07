import React from "react";
import { CiTrash } from "react-icons/ci";

export default function CourseItem({ course, onRemove }) {
  if (!course) {
    return (
      <div className="text-center text-red-500">
        داده دوره نامعتبر است
      </div>
    );
  }

  const price = Number(course?.price ?? 0);
  const discount = Number(course?.discountPercent ?? 0);
  const isFree = price === 0 || course?.isFree;

  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  const formatPrice = (value) =>
    value.toLocaleString("fa-IR") + " تومان";

  return (
    <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-light-blue rounded-md hover:shadow-md transition-shadow duration-300 bg-white">
      {/* Thumbnail */}
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full sm:w-40 h-24 object-cover rounded-md shrink-0"
        loading="lazy"
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-xl text-primary">
          {course.title}
        </h3>
        <p className="mt-1 text-secondery text-sm sm:text-base line-clamp-2">
          {course.shortDescription}
        </p>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end gap-2">
        <p className="text-lg font-medium">
          {isFree ? (
            <span className="text-green-600 font-bold">
              رایگان
            </span>
          ) : discount > 0 ? (
            <>
              <span className="line-through text-gray-400 ml-2 text-sm">
                {formatPrice(price)}
              </span>
              <span className="text-primary font-bold">
                {formatPrice(discountedPrice)}
              </span>
            </>
          ) : (
            <span className="text-primary font-bold">
              {formatPrice(price)}
            </span>
          )}
        </p>

        <button
          onClick={() => onRemove(course._id)}
          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-300"
        >
          <CiTrash className="text-xl" />
        </button>
      </div>
    </li>
  );
}
