import FadeIn from "@/components/shared/fade-in";
import { Description, Chip, Subtitle } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Ellipsis, Heart } from "lucide-react";

const MobileComentSection = () => {
  return (
    <FadeIn>
      <div className="flex flex-col gap-1">
        <InputGroup className="h-12">
          <InputGroupInput
            placeholder="로그인 후 작성 가능합니다"
            className="p-5 placeholder:font-medium text-[14px]"
          />
          <InputGroupAddon align="inline-end">
            <Button>등록</Button>
          </InputGroupAddon>
        </InputGroup>
        <div className="flex justify-end">
          <Chip className="text-black-80 text-[12px]">{`${10}/100`}</Chip>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <Description>최신순</Description>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="space-y-4 pb-20">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <Subtitle>이름</Subtitle>
                      <Chip className="text-black-80 text-[12px]">
                        1시간 전
                      </Chip>
                    </div>
                    <Ellipsis className="w-4 h-4" />
                  </div>
                  <div className="flex gap-1 items-center h-6">
                    <Heart fill="black" className="w-4 h-4 flex-shrink-0" />
                    <Chip as="span" className="m-0 leading-none">
                      12
                    </Chip>
                  </div>
                  <Separator />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default MobileComentSection;
