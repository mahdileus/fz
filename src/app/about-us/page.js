import AboutUsHeader from "../components/template/About-Us/AboutUsHeader";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import AboutUsStats from "../components/template/About-Us/AboutUsStats";
import FAQAccordion from "../components/template/About-Us/FAQAccordion";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";

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