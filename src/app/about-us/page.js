import AboutUsHeader from "../components/template/About-Us/AboutUsHeader";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import AboutUsStats from "../components/template/About-Us/AboutUsStats";
import FAQAccordion from "../components/template/About-Us/FAQAccordion";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";

export const metadata = {
  title: "درباره ما – فیروزه جواهریان",
  description: "تیم و اهداف آکادمی توسعه فردی فیروزه جواهریان",
  openGraph: {
    title: "درباره ما – فیروزه جواهریان",
    description: "تیم و اهداف آکادمی توسعه فردی فیروزه جواهریان",
    url: "https://firouzehjavaherian.com/about-us",
    images: [{ url: "/images/logo/fj-logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره ما – فیروزه جواهریان",
    description: "تیم و اهداف آکادمی توسعه فردی فیروزه جواهریان",
    images: ["/images/logo/fj-logo.png"],
  },
};



const AboutUs = async () => {
  connectToDB()
  const user = await authUser()

  return (
    <>
    <Navbar isLogin={user ? true : false} />
    <AboutUsHeader/>
    <AboutUsStats/>
    <FAQAccordion/>
    
    <Footer/>
    </>
  );
};

export default AboutUs;