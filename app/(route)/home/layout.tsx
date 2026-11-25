import { PropsWithChildren } from "react";

import HomeShell from "@/app/feature/home/components/home-shell";

export default function HomeLayout({ children }: PropsWithChildren) {
  return <HomeShell>{children}</HomeShell>;
}
