import Sidebar from "@/app/components/modules/p-user/Sidebar";
import Topbar from "@/app/components/modules/p-user/Topbar";
import { authUser } from "@/utils/auth-server";
import { redirect } from "next/navigation";

export default async function userDashboardLayout({ children }) {
  const user = await authUser()
  if (!user) {
    redirect("/login-register");
  }
  return (
    <div className="flex h-screen bg-cream text-primary">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
