// pages/courses/page.js
export const dynamic = 'force-dynamic';

import { authUser } from "@/utils/auth-server";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import ArticleModel from "@/models/Article"
import connectToDB from "@/configs/db";
import { CiFileOn } from "react-icons/ci";
import Posts from "../components/template/Posts/Posts";


export const metadata = {
  title: "مقالات توسعه فردی",
  description: "آخرین مقالات و نکات کاربردی در حوزه رشد فردی و موفقیت",
  alternates: {
    canonical: "https://firouzehjavaherian.com/posts",
  },
  openGraph: {
    title: "مقالات توسعه فردی",
    description: "آخرین مقالات و نکات کاربردی در حوزه رشد فردی و موفقیت",
    url: "https://firouzehjavaherian.com/posts",
    images: [{ url: "/logo/fj-logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "مقالات توسعه فردی",
    description: "آخرین مقالات و نکات کاربردی در حوزه رشد فردی و موفقیت",
    images: ["/logo/fj-logo.png"],
  },
};



const PostsArchive = async () => {
  await connectToDB();
  const posts = await ArticleModel.find({}).sort({ createdAt: -1 }).lean();
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));
  const allCategories = Array.from(new Set(posts.map(p => p.category)));
  const user = await authUser();
  return (
    <>
      <Navbar isLogin={user ? true : false} />
      <div className="flex justify-center items-center gap-4 pt-20">
        <CiFileOn className="w-10 h-10 text-secondery" />
        <h1 className="text-center text-3xl text-primary font-bold font-kalameh ">مقالات </h1>

      </div>

      <Posts posts={JSON.parse(JSON.stringify(posts))} tags={allTags}
        categories={allCategories} />
      <Footer />
    </>
  );
};

export default PostsArchive;