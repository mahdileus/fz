import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import Wishlist from "@/models/Wishlist";
import CourseModel from "@/models/Course";
import PodcastModel from "@/models/Podcast";
import ArticleModel from "@/models/Article";
import CourseCard from "@/app/components/modules/courses/CourseCard";
import PodcastBox from "@/app/components/modules/podcast/PodcastBox/PodcastBox";
import ArticleCard from "@/app/components/modules/blogs/ArticleCard";


export default async function WishlistPage() {
  await connectToDB();
  const user = await authUser();

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-500">
          لطفاً برای مشاهده لیست علاقه‌مندی‌ها وارد شوید
        </h2>
        <a href="/login" className="mt-4 inline-block text-blue-500 hover:underline">
          ورود به حساب
        </a>
      </div>
    );
  }

  // دریافت لیست علاقه‌مندی‌ها برای هر نوع
  const coursesWishlist = await Wishlist.find({ user: user._id, itemType: "course" }).lean();
  const podcastsWishlist = await Wishlist.find({ user: user._id, itemType: "podcast" }).lean();
  const articlesWishlist = await Wishlist.find({ user: user._id, itemType: "article" }).lean();

  // تابع برای تبدیل ObjectId به رشته در آرایه‌ها
  const convertObjectIdsToStrings = (item) => {
    const converted = { ...item, _id: item._id.toString() };
    // تبدیل tags در Podcast
    if (converted.tags && Array.isArray(converted.tags)) {
      converted.tags = converted.tags.map((tag) =>
        tag && typeof tag === "object" && tag._id ? tag._id.toString() : tag
      );
    }
    // تبدیل category در Article
    if (converted.category && typeof converted.category === "object" && converted.category._id) {
      converted.category = converted.category._id.toString();
    }
    return converted;
  };

  // دریافت اطلاعات کامل آیتم‌ها و تبدیل ObjectId به رشته
  const courses = await CourseModel.find({
    _id: { $in: coursesWishlist.map((w) => w.item) },
  })
    .lean()
    .then((items) =>
      items.map((item) => ({
        _id: item._id.toString(),
        title: item.title,
        thumbnail: item.thumbnail || "/images/default-thumbnail.jpg",
        shortDescription: item.shortDescription,
        price: item.price,
        discountPercent: item.discountPercent || 0,
        score: item.score || 4.7,
      }))
    );

  const podcasts = await PodcastModel.find({
    _id: { $in: podcastsWishlist.map((w) => w.item) },
  })
    .lean()
    .then((items) => items.map((item) => convertObjectIdsToStrings({
        _id: item._id,
        title: item.title,
        thumbnail: item.thumbnail || "/images/default-thumbnail.jpg",
        duration: item.duration,
        tags: item.tags || [],
      }))
    );

  const articles = await ArticleModel.find({
    _id: { $in: articlesWishlist.map((w) => w.item) },
  })
    .lean()
    .then((items) => items.map((item) => convertObjectIdsToStrings({
        _id: item._id,
        title: item.title,
        thumbnail: item.thumbnail || "/images/default-thumbnail.jpg",
        shortDescription: item.shortDescription,
        createdAt: item.createdAt,
        author: item.author,
        category: item.category || null,
      }))
    );

  // تابع برای رندر هر بخش
  const renderSection = (title, items, itemType, Component, componentPropsKey = "item") => (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6 text-primary">{title}</h2>
      {items.length === 0 ? (
        <p className="text-secondery text-xl text-center py-4"> لیست خالی است</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="relative">
              <Component
                {...{ [componentPropsKey]: item }}
                itemType={itemType}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {renderSection("دوره‌ها", courses, "course", CourseCard, "course")}
      {renderSection("پادکست‌ها", podcasts, "podcast", PodcastBox, "podcast")}
      {renderSection("مقالات", articles, "article", ArticleCard, "post")}
    </div>
  );
}