import { PropsWithChildren } from "react";
import BottomNavigation from "@/app/shared/bottom-navigation";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      {children}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
