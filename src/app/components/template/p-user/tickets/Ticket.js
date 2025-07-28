import Link from "next/link";

const Ticket = ({ _id, title, createdAt, department, hasAnswer }) => {
  return (
    <Link
      href={`/p-user/tickets/answer/${_id}`}
      className="block border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        {/* Left - Title & Department */}
        <div className="mb-2 sm:mb-0">
          <p className="text-lg font-semibold text-gray-800 mb-1">{title}</p>
          <p className="text-sm text-gray-500">{department?.title || "بدون دپارتمان"}</p>
        </div>

        {/* Right - Date & Status */}
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleDateString("fa-IR")}
          </p>
          <p
            className={`text-sm mt-1 font-medium ${
              hasAnswer ? "text-green-600" : "text-red-500"
            }`}
          >
            {hasAnswer ? "پاسخ داده شده" : "پاسخ داده نشده"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Ticket;
