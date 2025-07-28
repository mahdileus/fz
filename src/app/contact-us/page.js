
import connectToDB from "@/configs/db";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import MapBox from "../components/template/contact-us/MapBox";
import { authUser } from "@/utils/auth-server";

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