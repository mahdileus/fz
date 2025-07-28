import { authUser } from "@/utils/auth-server";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import MyStoryDescription from "../components/template/my-story/MyStoryDescription";
import MyStoryHeader from "../components/template/my-story/MyStoryHeader";

const MyStory = async () => {
  const user = authUser()

  return (
    <>
    <Navbar isLogin={user ? true : false}/>
    <MyStoryHeader/>
    <MyStoryDescription/>
    
    <Footer/>
    </>
  );
};

export default MyStory;