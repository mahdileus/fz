"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({ icon, label, href }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-full transition-all cursor-pointer 
        hover:bg-secondery hover:text-cream ${
          isActive ? "bg-primary text-cream font-bold w-full" : "text-primary"
        }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="hidden md:block">{label}</span>
    </Link>
  );
}
