import EditArticleForm from "@/app/components/template/p-admin/article/EditArticleForm";
import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";

export default async function EditArticlePage({ params }) {
      const { id } = await params;

  await connectToDB();
  const article = await ArticleModel.findById( id).lean();

  return (
    <div className="mt-10">
      <EditArticleForm
        article={JSON.parse(JSON.stringify(article))}
        articleId={id}
      />
    </div>
  );
}
