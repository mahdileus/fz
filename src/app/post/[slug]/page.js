export const revalidate = 86400;


import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import ArticleModel from "@/models/Article";
import CourseModel from "@/models/Course";
import PodcastModel from "@/models/Podcast";
import Script from 'next/script';  // اضافه برای JSON-LD
import { notFound } from 'next/navigation';  // اضافه برای 404
import Navbar from "@/app/components/modules/navbar/Navbar";
import ArticleHeader from "@/app/components/template/article/ArticleHeader";
import CommentBox from "@/app/components/modules/comments/CommentBox";
import Footer from "@/app/components/modules/footer/Footer";

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
  const latestCourse = await CourseModel.find({})
    .sort({ createdAt: -1 }) // جدیدترین‌ها
    .lean();
  const latestPodcast = await PodcastModel.find({})
    .sort({ createdAt: -1 }) // جدیدترین‌ها
    .limit(3)
    .lean();



  if (!article) {
    notFound();  // اضافه: 404 برگردون اگر مقاله نبود
  }

  const latestArticles = await ArticleModel.find({})
    .sort({ createdAt: -1 }) // جدیدترین‌ها
    .limit(3)
    .lean();

  const user = await authUser();

  // اضافه: Structured Data برای Article schema (خفن برای سئو)
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://firouzehjavaherian.com/posts/${slug}`
    },
    "headline": article.title,
    "description": article.shortDescription,
    "image": [article.thumbnail],
    "author": {
      "@type": "Person",
      "name": article.author || "فیروزه جواهریان"
    },
    "publisher": {
      "@type": "Organization",
      "name": "فیروزه جواهریان",
      "logo": {
        "@type": "ImageObject",
        "url": "https://firouzehjavaherian.com/logo/fj-logo.png"
      }
    },
    "datePublished": article.createdAt?.toISOString(),
    "dateModified": article.updatedAt?.toISOString()
  };


  return (
    <>
      <Script id="article-schema" type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>
      <Navbar isLogin={user ? true : false} />
      <ArticleHeader article={JSON.parse(JSON.stringify(article))}
        articles={JSON.parse(JSON.stringify(latestArticles))}
        course={JSON.parse(JSON.stringify(latestCourse))}
        podcasts={JSON.parse(JSON.stringify(latestPodcast))}
      />
      <CommentBox />
      <Footer />
    </>
  );
};

export default Article;