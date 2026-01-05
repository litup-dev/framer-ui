import FadeIn from "@/components/shared/fade-in";
import {
  Title,
  Chip,
  Subtitle,
  Description,
} from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Ellipsis, Heart } from "lucide-react";

const CommentSection = () => {
  return (
    <FadeIn>
      <div className="space-y-4 pb-20 md:pb-0">
        {/* 데스크탑: 코멘트 타이틀 + 카운트 */}
        <div className="hidden md:flex items-center">
          <Title className="text-[20px] xl:text-[22px] 2xl:text-[24px]">comment</Title>
        </div>

        {/* 데스크탑: Textarea + 등록 버튼 */}
        <div className="hidden md:block space-y-4">
          <Textarea
            placeholder="댓글을 입력해주세요"
            className="h-[100px] resize-none"
          />
          <div className="w-full flex justify-between items-center">
            <Chip className="text-black-40 text-[14px] lg:text-[16px]">{`${10}/100`}</Chip>
            <Button>등록</Button>
          </div>
        </div>

        {/* 모바일: InputGroup inline */}
        <div className="md:hidden flex flex-col gap-1">
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
            <Chip className="text-black-40 text-[12px]">{`${10}/100`}</Chip>
          </div>
        </div>

        {/* 정렬 드롭다운 */}
        <div className="flex items-center gap-6 md:gap-4">
          <div className="flex items-center">
            <Subtitle className="font-semibold text-[14px] xl:text-[16px]">
              최신순
            </Subtitle>
            <ChevronDown className="w-5 h-5 xl:w-6 xl:h-6" />
          </div>
        </div>

        {/* 댓글 리스트 */}
        <div className="flex flex-col gap-4 md:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 md:space-y-4">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 2xl:w-10 2xl:h-10rounded-full bg-gray-200" />
                  <Subtitle className="text-[14px] md:text-[16px] 2xl:text-[18px]">이름</Subtitle>
                  <Description className="text-black-40 text-[12px] md:text-[14px] 2xl:text-[16px]">1시간 전</Description>
                </div>
                <Ellipsis className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              <Chip className="font-normal text-black-80 text-[14px] md:text-[16px] 2xl:text-[18px]">내용내용내용</Chip>

              {/* 좋아요 */}
              <div className="pt-6">
                <div className="flex gap-1 items-center">
                  <Heart fill="black" className="w-6 h-6 flex-shrink-0" />
                  <Description className="font-medium text-[12px] md:text-[14px] 2xl:text-[16px]">
                    12
                  </Description>
                </div>
              </div>

              <Separator />
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
};

export default CommentSection;
