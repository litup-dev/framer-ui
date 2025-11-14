import { PropsWithChildren } from "react";
import Header from "@/app/shared/components/header";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
