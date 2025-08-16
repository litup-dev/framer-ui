"use client";

import Link from "next/link";
import { CalendarCheck, Club, House, User, Users } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { href: "/", icon: House, label: "홈" },
  { href: "/community", icon: Users, label: "커뮤니티" },
  { href: "/concert-schedule", icon: CalendarCheck, label: "공연일정" },
  { href: "/club", icon: Club, label: "클럽" },
  { href: "/user", icon: User, label: "프로필" },
];

const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg max-w-2xl m-auto">
      <div className="flex items-center justify-around px-4 py-2">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`}
              aria-label={label}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
