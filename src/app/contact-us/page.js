
import connectToDB from "@/configs/db";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import MapBox from "../components/template/contact-us/MapBox";
import { authUser } from "@/utils/auth-server";

export const metadata = {
  title: "تماس با ما",
  description: "اطلاعات تماس و فرم ارتباط با آکادمی فیروزه جواهریان",
  openGraph: {
    title: "تماس با ما",
    description: "اطلاعات تماس و فرم ارتباط با آکادمی فیروزه جواهریان",
    url: "https://firouzehjavaherian.com/contact-us",
    images: [{ url: "/images/logo/fj-logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "تماس با ما",
    description: "اطلاعات تماس و فرم ارتباط با آکادمی فیروزه جواهریان",
    images: ["/images/logo/fj-logo.png"],
  },
};



const ContactUs = async () => {
  await connectToDB();
   const user = await authUser();


  return (
    <>
    <Navbar isLogin={user ? true : false}/>
    <MapBox/>
    
    <Footer/>
    </>
  );
};

export default ContactUs;