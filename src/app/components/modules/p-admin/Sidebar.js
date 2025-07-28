"use client"
import { CiHome, CiVideoOn, CiMicrophoneOn, CiFileOn, CiHeadphones, CiChat2, CiUser, CiLogout } from "react-icons/ci";
import Image from "next/image";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import swal from "sweetalert";
import { usePathname, useRouter } from "next/navigation";



export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  const logoutHandler = () => {
    swal({
      title: "آیا از خروج اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "آره"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/auth/signout", {
          method: "POST",
        });

        if (res.status === 200) {
          swal({
            title: "با موفقیت از اکانت خارج شدین",
            icon: "success",
            buttons: "فهمیدم",
          }).then((result) => {
            router.replace("/");
          });
        }
      }
    });
  };
  return (
    <aside className="w-20 md:w-64 bg-white p-4 flex flex-col items-center gap-4 border-l border-primary">
      <Link href="/" >
      <Image src={"/logo/fj-logo.png"} width={40} height={40} alt="logo" />
      </Link>

      <nav className="flex flex-col justify-between h-full w-full text-sm mt-12 text-cream">
        <div className="flex flex-col gap-4">
          <SidebarItem icon={<CiHome className="w-8 h-8" />} label="پیشخوان" href="/p-admin/dashboard" />
          <SidebarItem icon={<CiVideoOn className="w-8 h-8" />} label="دوره‌ها" href="/p-admin/courses" />
          <SidebarItem icon={<CiMicrophoneOn className="w-8 h-8" />} label="پادکست‌ها" href="/p-admin/podcasts" />
          <SidebarItem icon={<CiFileOn className="w-8 h-8" />} label="مقالات" href="/p-admin/posts" />
          <SidebarItem icon={<CiHeadphones className="w-8 h-8" />} label="پشتیبانی" href="/p-admin/tickets" />
          <SidebarItem icon={<CiChat2 className="w-8 h-8" />} label="نظرات" href="/p-admin/comments" />
        </div>
        <div className="flex flex-col gap-4">
          <SidebarItem icon={<CiUser className="w-8 h-8" />} label=" کاربران" href="/p-admin/users" />
          <div onClick={logoutHandler}>
            <SidebarItem icon={<CiLogout className="w-8 h-8" />} label="خروج" href={"/p-admin"} />
          </div>

        </div>
      </nav>
    </aside>
  );
}
