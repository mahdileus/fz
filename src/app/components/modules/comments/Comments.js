import Comment from "../comment/comment";
import CommentBox from "./CommentBox";

const Comments = ({ CourseID, comments }) => {
    
    
  const acceptedComments = comments.filter((comment) => comment.isAccept);

  return (
    <section className="container mt-12 bg-white p-6 rounded-xl shadow border border-gray-200 space-y-8">
      {/* تیتر و تعداد نظرات */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-xl font-bold text-primary">نظرات دوره</h2>
        <span className="text-sm text-gray-600">
          {acceptedComments.length} نظر ثبت شده
        </span>
      </div>

      {/* لیست نظرات */}
      <div className="space-y-4">
        {acceptedComments.length > 0 ? (
          acceptedComments.map((comment) => (
            <Comment key={comment._id} {...comment} />
          ))
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
