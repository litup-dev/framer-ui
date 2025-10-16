import FadeIn from "@/components/shared/fade-in";
import { serverApiClient } from "@/lib/api-client";

import HeroSection from "@/app/feature/home/components/hero-section";
import CharacterSection from "@/app/feature/home/components/character-section";
import MainContent from "@/app/feature/home/components/main-content";
import { Calendar } from "@/components/ui/calendar";

export default async function Home() {
  const clubs = await serverApiClient.get("/api/v1/clubs");

  console.log(clubs);

  return (
    <FadeIn>
      <div className="w-full flex flex-col h-full gap-30 pb-20 px-20 pt-20">
        <HeroSection />
        <CharacterSection />
        <MainContent />
        <Calendar />
      </div>
    </FadeIn>
  );
}
