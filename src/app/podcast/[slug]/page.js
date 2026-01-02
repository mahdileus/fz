import { notFound } from "next/navigation";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import PodcastModel from "@/models/Podcast";
import connectToDB from "@/configs/db";
import PodcastHeader from "@/app/components/modules/podcast/podcastheader/PodcastHeader";
import { authUser } from "@/utils/auth-server";
import Script from "next/script";


export const revalidate = 86400; // ISR - روزی یک بار

export async function generateMetadata({ params }) {
  const { slug } = await params;

  await connectToDB();
  const podcast = await PodcastModel.findOne({ slug }).lean();

  if (!podcast) {
    return {
      title: "پادکست یافت نشد",
      description: "این پادکست وجود ندارد",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${podcast.title} | فیروزه جواهریان`;
  const description =
    podcast.longDescription?.slice(0, 160) ||
    "پادکست آموزشی و انگیزشی در حوزه توسعه فردی";

  const image =
    podcast.thumbnail?.startsWith("http")
      ? podcast.thumbnail
      : "https://firouzehjavaherian.com/images/logo/fj-logo.png";

  const url = `https://firouzehjavaherian.com/podcasts/${slug}`;

  return {
    metadataBase: new URL("https://firouzehjavaherian.com"),
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Firouzeh Javaherian",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: podcast.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const Podcast = async ({ params }) => {
  const { slug } = await params;

  await connectToDB();
  const podcast = await PodcastModel.findOne({ slug }).lean();

  if (!podcast) {
    notFound();
  }

  const user = await authUser();
  const schema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    "name": podcast.title,
    "description": podcast.longDescription,
    "url": `https://firouzehjavaherian.com/podcasts/${slug}`,
    "datePublished": podcast.createdAt?.toISOString(),
    "associatedMedia": {
      "@type": "MediaObject",
      "contentUrl": podcast.audioUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "فیروزه جواهریان",
      "logo": {
        "@type": "ImageObject",
        "url": "https://firouzehjavaherian.com/logo/fj-logo.png",
      },
    },
  };


  return (
    <>
    <Script id="podcast-schema" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
      <Navbar isLogin={!!user} />
      <PodcastHeader podcast={podcast} />
      <Footer />
    </>
  );
};

export default Podcast;
