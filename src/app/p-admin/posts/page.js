import ArticleBox from "@/app/components/template/p-admin/article/ArticleBox";
import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import Link from "next/link";
export default async function page() {
  await connectToDB();
  const articles = await ArticleModel.find().sort({ createdAt: -1 }).lean();

  return (
    <section className=" mt-14 container">
      <div className=" px-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-6">تمام مقالات</h1>
        </div>
        <div>
          <Link href={"/p-admin/posts/add-post"} className="text-cream bg-primary p-3 rounded-2xl">افزودن مقاله جدید</Link>

        </div>
        
      </div>
              {articles.map((article) => (
            <ArticleBox key={article._id} article={JSON.parse(JSON.stringify(article))} />
          ))}
    </section>
  );
}
