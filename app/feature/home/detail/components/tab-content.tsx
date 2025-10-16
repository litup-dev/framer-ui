import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Description } from "@/components/shared/typography";
import MobileDetailSections from "@/app/feature/home/detail/components/mobile-detail-sections";
import MobileComentSection from "@/app/feature/home/detail/components/mobile-coment-section";

const TabContent = () => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="w-full bg-white">
        <TabsTrigger value="account">
          <Description>상세정보</Description>
        </TabsTrigger>
        <TabsTrigger value="coment">
          <Description>코멘트(10)</Description>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="">
        <MobileDetailSections />
      </TabsContent>
      <TabsContent value="coment">
        <MobileComentSection />
      </TabsContent>
    </Tabs>
  );
};

export default TabContent;
