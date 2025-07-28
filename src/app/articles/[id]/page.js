import CommentBox from "@/app/components/modules/comments/CommentBox";
import Footer from "../../components/modules/footer/Footer";
import Navbar from "../../components/modules/navbar/Navbar";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import ArticleHeader from "@/app/components/template/article/ArticleHeader";
import ArticleModel from "@/models/Article"


const Article = async ({ params }) => {
  await connectToDB();
  const { id: ArticleID } = await params; // Await params and destructure id
  const article = await ArticleModel.findOne({ _id: ArticleID }).populate("comments");
  const user = await authUser();
  

  return (
    <>
      <Navbar isLogin={user ? true : false}/>
      <ArticleHeader article={JSON.parse(JSON.stringify(article))}/>
      <CommentBox />
      <Footer />
    </>
  );
};

export default Article;