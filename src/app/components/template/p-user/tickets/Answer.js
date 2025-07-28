import Image from "next/image";

const Answer = ({ type, title, body, createdAt, user }) => {
  const isUser = type === "user";

  return (
    <section
      className={`w-full rounded-2xl p-4 mb-4 shadow-md ${
        isUser ? "bg-secondery shadow-md" : "bg-primary shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-white">
          {new Date(createdAt).toLocaleDateString("fa-IR")}
        </p>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base font-semibold text-white">{user?.name}</p>
            <span className="text-sm text-white">
              {isUser ? "کاربر" : "مدیر"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-gray-200 text-gray-700 leading-relaxed">
        <p>{body}</p>
      </div>
    </section>
  );
};

export default Answer;
