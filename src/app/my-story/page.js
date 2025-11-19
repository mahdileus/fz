import { authUser } from "@/utils/auth-server";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import MyStoryDescription from "../components/template/my-story/MyStoryDescription";
import MyStoryHeader from "../components/template/my-story/MyStoryHeader";

export const metadata = {
  title: "داستان من – فیروزه جواهریان",
  description: "مسیر زندگی و تجربیات فیروزه جواهریان در حوزه توسعه فردی و کوچینگ",
  alternates: {
    canonical: "https://firouzehjavaherian.com/my-story",
  },
  openGraph: {
    title: "داستان من – فیروزه جواهریان",
    description: "مسیر زندگی و تجربیات فیروزه جواهریان در حوزه توسعه فردی و کوچینگ",
    url: "https://firouzehjavaherian.com/my-story",
    images: [{ url: "/logo/fj-logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "داستان من – فیروزه جواهریان",
    description: "مسیر زندگی و تجربیات فیروزه جواهریان در حوزه توسعه فردی و کوچینگ",
    images: ["/logo/fj-logo.png"],
  },
};



const MyStory = async () => {
  const user = authUser()

  return (
    <>
      <Navbar isLogin={user ? true : false} />
      <MyStoryHeader />
      <MyStoryDescription />

      <Footer />
    </>
  );
};

export default MyStory;