import Logo from "@/app/shared/components/logo";
import { MenuIcon } from "lucide-react";

const MobileHeader = () => {
  return (
    <div className="px-5 py-2 justify-between flex md:hidden">
      <Logo />
      <MenuIcon />
    </div>
  );
};

export default MobileHeader;
