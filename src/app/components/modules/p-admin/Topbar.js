// components/dashboard/Topbar.jsx
import { CiBellOn } from "react-icons/ci";

export default function Topbar() {
  return (
    <header className="flex justify-between items-center p-4 border-b border-primary bg-white">
      <h2 className="text-primary">مهدی نوری عزیز به وبسایت خودت خوش اومدی.</h2>
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
