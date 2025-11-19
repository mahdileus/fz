import CommentBox from "@/app/components/modules/comments/CommentBox";
import Footer from "../../components/modules/footer/Footer";
import Navbar from "../../components/modules/navbar/Navbar";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import ArticleHeader from "@/app/components/template/article/ArticleHeader";
import ArticleModel from "@/models/Article";
/**
 * generateMetadata برای صفحه مقاله داینامیک
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  await connectToDB();

  const article = await ArticleModel.findOne({ slug }).lean();

  if (!article) {
    return {
      title: "مقاله یافت نشد",
      description: "این مقاله وجود ندارد",
    };
  }

  const title = `${article.title} – فیروزه جواهریان`;
  const description = article.shortDescription || "مقاله‌ای در حوزه توسعه فردی و موفقیت";

  return {
    title,
    description,
    alternates: {
      canonical: `https://firouzehjavaherian.com/posts/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://firouzehjavaherian.com/posts/${slug}`,
      type: "article",
      images: [
        {
          url: article.thumbnail || "/logo/fj-logo.png",
          width: 1200,
          height: 630,
        },
      ],
      article: {
        publishedTime: article.createdAt?.toISOString() || undefined,
        authors: ["فیروزه جواهریان"],
        tags: article.tags || [],
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.thumbnail || "/logo/fj-logo.png"],
    },
  };
}




const Article = async ({ params }) => {
    await connectToDB();

    const { slug } = await params;

    const article = await ArticleModel.findOne({ slug })
        .populate("comments")
        .lean();
    const latestArticles = await ArticleModel.find({})
        .sort({ createdAt: -1 }) // جدیدترین‌ها
        .limit(4)
        .lean();

    const user = await authUser();

    return (
        <>
            <Navbar isLogin={user ? true : false} />
            <ArticleHeader article={JSON.parse(JSON.stringify(article))}
            articles={JSON.parse(JSON.stringify(latestArticles))}
            />
            <CommentBox />
            <Footer />
        </>
    );
};

export default Article;
