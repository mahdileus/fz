import { FaRegStar, FaStar } from "react-icons/fa";

const Comment = ({ username, body, score, date, isAdminReply }) => {
  return (
    <section
      className={`flex items-start gap-4 p-4 rounded-lg border shadow-sm ${
        isAdminReply
          ? "bg-blue-50 border-blue-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* آواتار */}
      <img
        src={isAdminReply ? "/images/admin-avatar.png" : "/images/404.png"}
        alt="آواتار"
        className="w-12 h-12 rounded-full object-cover border"
      />

      {/* محتوا */}
      <div className="flex-1 space-y-2">
        {/* اطلاعات کاربر و امتیاز */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">
            {isAdminReply ? "مدیر سایت" : username}
            <p className="text-xs text-gray-500">
              {new Date(date).toLocaleDateString("fa-IR")}
            </p>
          </div>
          {!isAdminReply && (
            <div className="flex gap-0.5 text-yellow-400 text-sm mt-1 sm:mt-0">
              {Array(score)
                .fill(0)
                .map((_, index) => (
                  <FaStar key={index} />
                ))}
              {Array(5 - score)
                .fill(0)
                .map((_, index) => (
                  <FaRegStar key={index} />
                ))}
            </div>
          )}
        </div>

        {/* متن نظر */}
        <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
      </div>
    </section>
  );
};
export default Comment;
