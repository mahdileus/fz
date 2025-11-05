
import { authUser } from "@/utils/auth-server";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import Podcasts from "../components/template/Podcasts/Podcasts";
import PodcastModel from "@/models/Podcast"
import connectToDB from "@/configs/db";
import { CiMicrophoneOn } from "react-icons/ci";

export const metadata = {
  title: "پادکست‌ها",
  description: "مجموعه پادکست‌های آموزشی و انگیزشی فیروزه جواهریان",
  openGraph: {
    title: "پادکست‌ها",
    description: "مجموعه پادکست‌های آموزشی و انگیزشی فیروزه جواهریان",
    url: "https://firouzehjavaherian.com/podcasts",
    images: [{ url: "/images/logo/fj-logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "پادکست‌ها",
    description: "مجموعه پادکست‌های آموزشی و انگیزشی فیروزه جواهریان",
    images: ["/images/logo/fj-logo.png"],
  },
};


const PodcastsArchive = async () => {
  await connectToDB();
  const podcasts = await PodcastModel.find({}).sort({ createdAt: -1 }).lean();
  const allTags = Array.from(new Set(podcasts.flatMap(p => p.tags || [])));
  const allCategories = Array.from(new Set(podcasts.map(p => p.category)));
  const user = await authUser();


  return (
    <>
      <Navbar isLogin={user ? true : false} />
      <div className="flex justify-center items-center gap-4 pt-20">
        <CiMicrophoneOn className="w-10 h-10 text-secondery" />
        <h1 className="text-center text-3xl text-primary font-bold font-kalameh ">پادکست ها</h1>

      </div>

      <Podcasts podcasts={JSON.parse(JSON.stringify(podcasts))} tags={allTags}
        categories={allCategories} />
      <Footer />
    </>
  );
};

export default PodcastsArchive;