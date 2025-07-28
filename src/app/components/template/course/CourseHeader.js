"use client";

export default function CourseHeader({ course }) {
  const discount = course.discountPercent || 0;
  const price = course.price || 0;
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;



  return (
    <section className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* ویدیو معرفی */}
      <div className="lg:col-span-2 w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <video
          controls
          className="w-full h-full object-cover rounded-xl"
          poster={course.thumbnail}
        >
          <source src={course.introVideo} />
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
      </div>

      {/* اطلاعات کلی دوره */}
      <div className="flex flex-col justify-between bg-white rounded-xl shadow-lg p-6 space-y-6 border border-[#DBE2EF]">
        <div>
          <h1 className="text-2xl text-center font-bold text-primary leading-9 py-5">
            {course.title}
          </h1>
          <p className="text-base text-gray-700 text-justify text-align-last-center">
            {course.shortDescription}
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="flex flex-col items-center gap-1 text-sm text-primary">
            {discount > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white bg-secondery px-2 py-0.5 rounded-full">
                    {discount}٪
                  </span>
                  <span className="line-through text-gray-400 text-base">
                    {price.toLocaleString()} تومان
                  </span>
                </div>
                <span className=" font-bold text-2xl">
                  {discountedPrice.toLocaleString()} تومان
                </span>
              </>
            ) : (
              <span className="text-base font-bold">
                {price.toLocaleString()} تومان
              </span>
            )}
          </div>

          <button className="w-full bg-primary text-white py-3 rounded-xl text-lg hover:bg-secondery transition">
            ثبت‌نام و شروع دوره
          </button>
        </div>
      </div>
    </section>
  );
}
