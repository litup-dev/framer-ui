import { PropsWithChildren } from "react";
import HomeCharacterImage from "@/app/feature/home/components/home-character-image";

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative overflow-x-hidden">
      <HomeCharacterImage />
      {children}
    </div>
  );
}
