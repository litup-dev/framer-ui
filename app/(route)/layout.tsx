import { PropsWithChildren } from "react";
import Header from "@/app/shared/components/header";
// import BottomNavigation from "@/app/shared/bottom-navigation";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full">
      <Header />
      {children}
      {/* <BottomNavigation /> */}
    </div>
  );
};

export default Layout;
