import CommentBox from "@/app/components/modules/comments/CommentBox";
import Footer from "../../components/modules/footer/Footer";
import Navbar from "../../components/modules/navbar/Navbar";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import ArticleHeader from "@/app/components/template/article/ArticleHeader";
import ArticleModel from "@/models/Article";

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
