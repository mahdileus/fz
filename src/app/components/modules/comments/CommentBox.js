"use client";
import { IoMdStar } from "react-icons/io";
import { useEffect, useState } from "react";
import { showSwal } from "@/utils/helpers";

const CommentBox = ({ CourseID }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [score, setScore] = useState(5);
  const [isSaveUserInfo, setIsSaveUserInfo] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUsername(userInfo.username || "");
      setEmail(userInfo.email || "");
    }
  }, []);

  const setCommentScore = (value) => {
    setScore(value);
    showSwal("امتیاز شما ثبت شد", "success", "ادامه ثبت کامنت");
  };

  const submitComment = async () => {
    if (!username || !email || !body) {
      return showSwal("لطفا تمام فیلدها را پر کنید", "error", "باشه");
    }

    if (isSaveUserInfo) {
      localStorage.setItem("userInfo", JSON.stringify({ username, email }));
    }

    const comment = { username, email, body, score, CourseID };

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });

    if (res.status === 201) {
      showSwal("کامنت شما با موفقیت ثبت شد", "success", "فهمیدم");
      setBody("");
    } else {
      showSwal("خطا در ارسال کامنت", "error", "باشه");
    }
  };

  return (
    <section className="container">

          <div className="mt-6 p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h3 className="text-lg font-semibold text-primary">دیدگاه خود را بنویسید</h3>
      <p className="text-sm text-gray-500">
        ایمیل شما منتشر نخواهد شد. بخش‌های الزامی با <span className="text-red-500">*</span> مشخص شده‌اند.
      </p>

      {/* امتیاز */}
      <div>
        <label className="block mb-2 font-medium">امتیاز شما:</label>
        <div className="flex gap-1 text-yellow-400 text-2xl cursor-pointer">
          {[5, 4, 3, 2, 1].map((val) => (
            <IoMdStar
              key={val}
              className={score >= val ? "text-yellow-400" : "text-gray-300"}
              onClick={() => setCommentScore(val)}
            />
          ))}
        </div>
      </div>

      {/* متن دیدگاه */}
      <div>
        <label className="block mb-2 font-medium">
          دیدگاه شما <span className="text-red-500">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={5}
        />
      </div>

      {/* نام و ایمیل */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">
            نام <span className="text-red-500">*</span>
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">
            ایمیل <span className="text-red-500">*</span>
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* ذخیره اطلاعات */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isSaveUserInfo}
          onChange={() => setIsSaveUserInfo((prev) => !prev)}
        />
        <span className="text-sm text-gray-600">
          ذخیره نام و ایمیل من برای دیدگاه‌های بعدی
        </span>
      </div>

      {/* دکمه ثبت */}
      <button
        onClick={submitComment}
        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
      >
        ثبت دیدگاه
      </button>
    </div>
    </section>
  );
};

export default CommentBox;
