import { PropsWithChildren } from "react";

const ConcertScheduleLayout = ({ children }: PropsWithChildren) => {
  return <div className="max-w-xl m-auto">{children}</div>;
};

export default ConcertScheduleLayout;
