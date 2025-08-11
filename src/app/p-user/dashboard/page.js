import SectionHeader from "@/app/components/modules/index/SectionHeader";
import DashboardStats from "@/app/components/template/p-user/dashboard/DashboardStats";
import LatestComments from "@/app/components/template/p-user/dashboard/Latest-Comments";
import LatestCourse from "@/app/components/template/p-user/dashboard/Latest-Course";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import CommentModel from "@/models/Comment";
import UserCourseModel from "@/models/UserCourse";
import TicketModel from "@/models/Ticket";
import WishlistModel from "@/models/Wishlist";


export default async function Dashboard() {
  await connectToDB();
  const user = await authUser();
  const userCommentsCount = await CommentModel.countDocuments({ userID: user.id });
  const userCoursesCount = await UserCourseModel.countDocuments({ user: user.id });
  const userWishlistCount = await WishlistModel.countDocuments({user: user.id});
  const userTicketsCount = await TicketModel.countDocuments({ user: user.id }); // اگر تیکت داری

  return (
    <section className="container mt-14">
      <DashboardStats
        userCommentsCount={userCommentsCount}
        userCoursesCount={userCoursesCount}
        userWishlistCount={userWishlistCount}
        userTicketsCount={userTicketsCount}
      />

      <LatestComments />
      <SectionHeader title="دوره های خریداری شده" href="/p-user/courses" type="course" />
      <LatestCourse />
      


    </section>
  );
}
