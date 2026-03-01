"use client";

import { Chip } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  commentText: string;
  maxLength: number;
  isAuthenticated: boolean;
  isPending: boolean;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

const CommentForm = ({
  commentText,
  maxLength,
  isAuthenticated,
  isPending,
  onTextChange,
  onSubmit,
}: CommentFormProps) => {
  const placeholder = isAuthenticated ? "댓글을 입력해주세요." : "로그인 후 작성 가능합니다";
  const isDisabled = !isAuthenticated || !commentText.trim() || isPending;

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        placeholder={placeholder}
        className="h-[70px] md:h-[100px] resize-none overflow-y-auto rounded-[6px] px-4 py-[13px] text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] 2xl:text-[18px] font-medium tracking-[-0.08em] lg:tracking-[-0.04em] leading-[160%]"
        value={commentText}
        onChange={onTextChange}
        disabled={!isAuthenticated}
        maxLength={maxLength}
      />
      <div className="w-full flex justify-between items-start">
        <Chip
          className="text-black-40 text-[12px] md:text-[14px] lg:text-[16px] font-medium tracking-[-0.08em] md:tracking-[-0.04em]"
        >
          {commentText.length}/{maxLength}
        </Chip>
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
          className="w-[56px] h-[34px] px-4 py-2.5 xl:w-16 xl:h-10 xl:px-[18px] xl:py-3"
        >
          {isPending ? "등록중..." : "등록"}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
