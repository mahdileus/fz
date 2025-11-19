
import connectToDB from "@/configs/db";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import MapBox from "../components/template/contact-us/MapBox";
import { authUser } from "@/utils/auth-server";

export const metadata = {
  title: "تماس با ما – فیروزه جواهریان",
  description: "اطلاعات تماس و فرم ارتباط با آکادمی فیروزه جواهریان",

  // canonical مشخص می‌کند که این URL نسخه اصلی صفحه است
  alternates: {
    canonical: "https://firouzehjavaherian.com/contact-us",
  },

  openGraph: {
    title: "تماس با ما – فیروزه جواهریان",
    description: "اطلاعات تماس و فرم ارتباط با آکادمی فیروزه جواهریان",
    url: "https://firouzehjavaherian.com/contact-us",
    images: [
      {
        url: "/logo/fj-logo.png", // بهتره تصویر اختصاصی OG بذاری
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "تماس با ما – فیروزه جواهریان",
    description: "اطلاعات تماس و فرم ارتباط با آکادمی فیروزه جواهریان",
    images: ["/logo/fj-logo.png"],
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