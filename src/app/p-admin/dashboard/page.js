import RevenueChart from "@/app/components/template/p-admin/dashboardChart/RevenueChart";
import UserSignupChart from "@/app/components/template/p-admin/dashboardChart/UserSignupChart";
import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import CourseModel from "@/models/Course";
import PodcastModel from "@/models/Podcast";
import ArticleModel from "@/models/Article";
import ContentBarChart from "@/app/components/template/p-admin/dashboardChart/ContentBarChart";
import WishlistPieChart from "@/app/components/template/p-admin/dashboardChart/WishlistPieChart";

const page = async () => {
  await connectToDB();

  // کاربران
  const users = await UserModel.find({}, "createdAt").lean();
  const signupCounts = {};
  users.forEach((user) => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      if (!isNaN(date.getTime())) {
        const isoDate = date.toISOString().slice(0, 10);
        signupCounts[isoDate] = (signupCounts[isoDate] || 0) + 1;
      }
    }
  });

  const signupData = Object.entries(signupCounts).map(([date, count]) => ({
    date,
    count,
  }));

  // محتوای سایت
  const [courseCount, podcastCount, articleCount] = await Promise.all([
    CourseModel.countDocuments(),
    PodcastModel.countDocuments(),
    ArticleModel.countDocuments(),
  ]);

  const contentData = [
    { type: "دوره‌ها", count: courseCount },
    { type: "پادکست‌ها", count: podcastCount },
    { type: "مقاله‌ها", count: articleCount },
  ];

  return (
    <section className="flex flex-col gap-6 mt-14">
      {/* ثبت‌نام کاربران و درآمد */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-md p-2.5">
          <h2 className="text-2xl font-bold mb-4 text-center">تعداد ثبت‌نام کاربران</h2>
          <UserSignupChart signupData={signupData} />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-2.5">
          <h2 className="text-2xl font-bold mb-4 text-center">درآمد سایت</h2>
          <RevenueChart />
        </div>
      </div>

      {/* آمار محتوای سایت */}
      <div className="bg-white rounded-2xl shadow-md p-2.5">
        <h2 className="text-2xl font-bold mb-4 text-center">آمار محتوای سایت</h2>
        <ContentBarChart data={contentData} />
      </div>

      {/* علاقه‌مندی‌ها */}
      <div className="bg-white rounded-2xl shadow-md p-2.5">
        <h2 className="text-2xl font-bold mb-4 text-center">آمار علاقه‌مندی‌ها</h2>
        <WishlistPieChart />
      </div>
    </section>
  );
};

export default page;
