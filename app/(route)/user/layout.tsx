import { PropsWithChildren } from "react";

const UserLayout = async ({ children }: PropsWithChildren) => {
  return <div className="max-w-xl m-auto">{children}</div>;
};

export default UserLayout;
