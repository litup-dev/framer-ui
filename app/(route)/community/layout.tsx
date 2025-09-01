import { PropsWithChildren } from "react";

const CommunityLayout = ({ children }: PropsWithChildren) => {
  return <div className="max-w-xl m-auto">{children}</div>;
};

export default CommunityLayout;
