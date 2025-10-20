import {
  Title,
  Chip,
  Subtitle,
  Description,
} from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Heart } from "lucide-react";
const DesktopComentSection = () => {
  return (
    <div className="border-t-4 border-[#FF491A] py-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Title className="text-black text-title-24">coment</Title>
          <Chip className="text-black-80 text-[12px]">{`${10}/100`}</Chip>
        </div>

        <Textarea
          placeholder="댓글을 입력해주세요"
          className="h-[100px] resize-none"
        />
        <div className="w-full flex justify-end">
          <Button>등록</Button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Subtitle className="text-black text-subtitle-16">최신순</Subtitle>
            <ChevronDown className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <Subtitle>이름</Subtitle>
                  <Chip className="text-black-80 text-[12px]">1시간 전</Chip>
                </div>
                <Chip>내용내용내용</Chip>
                <div className="pt-4">
                  <div className="flex gap-1 items-center h-6">
                    <Heart fill="black" className="w-4 h-4 flex-shrink-0" />
                    <Chip as="span" className="m-0 leading-none">
                      12
                    </Chip>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopComentSection;
