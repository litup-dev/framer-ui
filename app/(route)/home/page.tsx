import PageWrapper from "@/app/shared/components/page-wrapper";

import HeroSection from "@/app/feature/home/components/hero-section";
import CharacterSection from "@/app/feature/home/components/character-section";
import MainContent from "@/app/feature/home/components/main-content";
import MobileBottomNavigation from "@/app/feature/home/components/mobile-bottom-navigation";

export default async function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <CharacterSection />
      <MainContent />
      <MobileBottomNavigation />
    </PageWrapper>
  );
}
