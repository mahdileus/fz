import CommentBox from "./CommentBox";
import Comment from "../comment/comment";

const Comments = ({ CourseID, comments }) => {
  const acceptedComments = comments.filter((comment) => comment.isAccept);

  // نظرات اصلی (کاربران)
  const mainComments = acceptedComments.filter((c) => !c.isAnswer);
  // پاسخ‌های مدیر
  const adminAnswers = acceptedComments.filter((c) => c.isAnswer);

  return (
    <section className="container mt-12 bg-white p-6 rounded-xl shadow border border-gray-200 space-y-8">
      {/* تیتر و تعداد نظرات */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-xl font-bold text-primary">نظرات دوره</h2>
        <span className="text-sm text-gray-600">
          {mainComments.length} نظر ثبت شده
        </span>
      </div>

      {/* لیست نظرات */}
      <div className="space-y-6">
        {mainComments.length > 0 ? (
          mainComments.map((comment) => {
            const answer = adminAnswers.find(
              (ans) => ans.mainComment === comment._id || ans.mainComment?._id === comment._id
            );
            return (
              <div key={comment._id} className="space-y-3">
                <Comment {...comment} />
                {answer && <Comment {...answer} isAdminReply />}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm text-center">
            هنوز نظری ثبت نشده است.
          </p>
        )}
      </div>

      {/* فرم ارسال نظر */}
      <div className="pt-4 border-t">
        <CommentBox CourseID={CourseID} />
      </div>
    </section>
  );
};

export default Comments;
