import Footer from "../../components/modules/footer/Footer";
import Navbar from "../../components/modules/navbar/Navbar";
import PodcastModel from "@/models/Podcast";
import connectToDB from "@/configs/db";
import PodcastHeader from "@/app/components/modules/podcast/podcastheader/PodcastHeader";
import { authUser } from "@/utils/auth-server";

export async function generateMetadata({ params }) {
  const { slug } = params;
  await connectToDB();

  const podcast = await PodcastModel.findOne({ slug }).lean();

  if (!podcast) {
    return {
      title: "پادکست یافت نشد",
      description: "این پادکست وجود ندارد",
    };
  }

  const title = `${podcast.title} – فیروزه جواهریان`;
  const description = podcast.longDescription || "پادکست آموزشی و انگیزشی در حوزه توسعه فردی";

  return {
    title,
    description,
    alternates: {
      canonical: `https://firouzehjavaherian.com/podcasts/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://firouzehjavaherian.com/podcasts/${slug}`,
      type: "article",
      images: [
        {
          url: podcast.thumbnail || "/images/logo/fj-logo.png",
          width: 1200,
          height: 630,
        },
      ],
      article: {
        publishedTime: podcast.createdAt?.toISOString() || undefined,
        authors: ["فیروزه جواهریان"],
        tags: podcast.tags || [],
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [podcast.thumbnail || "/images/logo/fj-logo.png"],
    },
  };
}

const Podcast = async ({ params }) => {
  await connectToDB();
  const { slug } = await params; // Await params and destructure id
  const podcast = await PodcastModel.findOne({ slug }).populate("comments");
  const user = await authUser();

  return (
    <>
      <Navbar isLogin={user ? true : false} />
      <PodcastHeader podcast={JSON.parse(JSON.stringify(podcast))} />
      <Footer />
    </>
  );
};

export default Podcast;