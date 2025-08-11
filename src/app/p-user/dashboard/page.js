import SectionHeader from "@/app/components/modules/index/SectionHeader";
import DashboardStats from "@/app/components/template/p-user/dashboard/DashboardStats";
import LatestComments from "@/app/components/template/p-user/dashboard/Latest-Comments";
import LatestCourse from "@/app/components/template/p-user/dashboard/Latest-Course";

export default function Dashboard() {

  return (
    <section className="container mt-14">
      <DashboardStats />
      <LatestComments/>
      <SectionHeader title="جدیدترین دوره‌ها" href="/p-user/courses" type="course" />
      <LatestCourse/>
      

    </section>
  );
}
