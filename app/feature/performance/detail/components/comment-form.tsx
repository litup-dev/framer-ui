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
  const placeholder = isAuthenticated ? "댓글을 입력해주세요" : "로그인 후 작성 가능합니다";
  const isDisabled = !isAuthenticated || !commentText.trim() || isPending;

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={placeholder}
        className="h-[100px] md:h-[70px] resize-none overflow-y-auto leading-[160%] tracking-[-0.04em]"
        style={{ letterSpacing: '-0.04em', lineHeight: '160%' }}
        value={commentText}
        onChange={onTextChange}
        disabled={!isAuthenticated}
        maxLength={maxLength}
      />
      <div className="w-full flex justify-between items-center">
        <Chip className="text-black-40 text-[12px] md:text-[14px] lg:text-[16px]">
          {commentText.length}/{maxLength}
        </Chip>
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
        >
          {isPending ? "등록중..." : "등록"}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
