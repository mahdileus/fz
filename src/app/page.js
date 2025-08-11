import Navbar from "./components/modules/navbar/Navbar";
import Footer from './components/modules/footer/Footer';
import HeroSection from "./components/template/index/HeroSection/HeroSection";
import SectionHeader from "./components/modules/index/SectionHeader";
import LatestCourse from "./components/modules/index/LatestCourse/LatestCourse";
import CourseModel from "@/models/Course";
import ArticleModel from "@/models/Article"
import PodcastModel from "@/models/Podcast"
import connectToDB from "@/configs/db";
import LatestPodcast from "./components/modules/index/LatestPodcast/LatestPodcast";
import { authUser } from "@/utils/auth-server";
import LatestArticle from "./components/modules/index/LatestBlogs/LatestArticle";
import AboutUs from "./components/template/index/aboutUs/AboutUs";
import CommentBox from "./components/template/index/commentBox/CommentBox";
import UserCourseModel from "@/models/UserCourse";




export default async function Home() {

  await connectToDB();
  const courses = await CourseModel.find({}).sort({createdAt: -1}).limit(8);
   const podcasts = await PodcastModel.find({}).sort({createdAt: -1}).limit(8);
   const user = await authUser();
   const posts = await ArticleModel.find({}).sort({createdAt: -1}).limit(8);
const userCourseRegs = await UserCourseModel.find({ user: user.id }).lean().populate('course');

  return (
    
  <div>
    <Navbar isLogin={user ? true : false} />
    <HeroSection/>
    <SectionHeader title="جدیدترین دوره‌ها" href="/courses" type="course" />
    <LatestCourse courses={JSON.parse(JSON.stringify(courses))} userCourseRegs={JSON.parse(JSON.stringify(userCourseRegs))}/>
    <AboutUs/>
    <SectionHeader title="جدیدترین پادکست ها" href="/podcasts" type="podcast" />
    <LatestPodcast podcasts={JSON.parse(JSON.stringify(podcasts))}/>
    <SectionHeader title="جدیدترین نظرات" type="comment" />
    <CommentBox/>
    <SectionHeader title="جدیدترین مقالات" href="/posts" type="article" />
    <LatestArticle posts={JSON.parse(JSON.stringify(posts))}/>

    <Footer/>

  </div>

  );
}




