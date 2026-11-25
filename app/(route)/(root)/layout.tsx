import { PropsWithChildren } from "react";

import HomeShell from "@/app/feature/home/components/home-shell";

// "/"는 home과 같은 화면(page.tsx가 home/page를 re-export)이라 같은 셸을 쓴다.
export default function RootLayout({ children }: PropsWithChildren) {
  return <HomeShell>{children}</HomeShell>;
}
