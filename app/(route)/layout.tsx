import { PropsWithChildren } from "react";
import BottomNavigation from "@/app/shared/bottom-navigation";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-w-xl m-auto">
      {children}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
