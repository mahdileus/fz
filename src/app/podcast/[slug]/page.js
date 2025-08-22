import Footer from "../../components/modules/footer/Footer";
import Navbar from "../../components/modules/navbar/Navbar";
import PodcastModel from "@/models/Podcast";
import connectToDB from "@/configs/db";
import PodcastHeader from "@/app/components/modules/podcast/podcastheader/PodcastHeader";
import { authUser } from "@/utils/auth-server";



const Podcast = async ({ params }) => {
  await connectToDB();
  const { slug } = await params; // Await params and destructure id
  const podcast = await PodcastModel.findOne({ slug }).populate("comments");
  const user = await authUser();

  return (
    <>
      <Navbar isLogin={user ? true : false} />
      <PodcastHeader podcast={JSON.parse(JSON.stringify(podcast))}/>
      <Footer />
    </>
  );
};

export default Podcast;