"use client"; // ✅ Mark this as a Client Component

import { MessageCircle, Search, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Now it's inside a Client Component

export default function Navigation() {
  const pathname = usePathname(); // ✅ Works now!

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-gray-800 h-16 flex justify-around items-center px-6">
      <NavItem href="/chatbot" icon={<MessageCircle className="w-6 h-6" />} label="Chatbot" isActive={pathname === "/chatbot"} />
      <NavItem href="/explore" icon={<Search className="w-6 h-6" />} label="Explore" isActive={pathname === "/explore"} />
      <NavItem href="/safety" icon={<Shield className="w-6 h-6" />} label="Safety" isActive={pathname === "/safety"} />
    </nav>
  );
}

function NavItem({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center ${isActive ? "text-blue-400" : "text-purple-400 hover:text-blue-400"}`}>
      <div className={`p-2 rounded-full ${isActive ? "bg-blue-900" : "hover:bg-purple-900"} transition-all duration-200 transform hover:scale-110`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}
