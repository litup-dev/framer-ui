import { PropsWithChildren } from "react";

const ClubLayout = ({ children }: PropsWithChildren) => {
  return <div className="max-w-xl m-auto">{children}</div>;
};

export default ClubLayout;
