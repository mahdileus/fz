// components/dashboard/Topbar.jsx
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import { CiBellOn } from "react-icons/ci";

export default async function Topbar() {
  await connectToDB();
  const user = await authUser();
  const username = user.name
  return (
    <header className="flex justify-between items-center p-4 border-b border-primary bg-white">
      <h2 className="text-primary">{username} عزیز به وبسایت خودت خوش اومدی.</h2>
      <div className="flex items-center gap-4">
        <CiBellOn className="w-8 h-8" />
        <img
          src="/avatar.jpg"
          alt="User"
          className="w-8 h-8 rounded-full border border-white"
        />
      </div>
    </header>
  );
}
