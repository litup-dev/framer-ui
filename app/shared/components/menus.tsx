import Link from "next/link";

import { MenuItems } from "@/app/shared/constants";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const HeaderMenus = () => {
  return (
    <div className="flex gap-2">
      {MenuItems.map((item) => (
        <Link key={item.id} href={item.href}>
          {item.label}
        </Link>
      ))}
      <AnimatedThemeToggler />
    </div>
  );
};

export default HeaderMenus;
