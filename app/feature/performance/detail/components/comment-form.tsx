"use client";

import { Chip } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface CommentFormProps {
  commentText: string;
  maxLength: number;
  isAuthenticated: boolean;
  isPending: boolean;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
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
  return (
    <>
      {/* 데스크탑: Textarea + 등록 버튼 */}
      <div className="hidden md:block space-y-4">
        <Textarea
          placeholder={isAuthenticated ? "댓글을 입력해주세요" : "로그인 후 작성 가능합니다"}
          className="h-[100px] resize-none"
          value={commentText}
          onChange={onTextChange}
          disabled={!isAuthenticated}
          maxLength={maxLength}
        />
        <div className="w-full flex justify-between items-center">
          <Chip className="text-black-40 text-[14px] lg:text-[16px]">
            {(commentText || "").length}/{maxLength}
          </Chip>
          <Button
            onClick={onSubmit}
            disabled={!isAuthenticated || !(commentText || "").trim() || isPending}
          >
            {isPending ? "등록중..." : "등록"}
          </Button>
        </div>
      </div>

      {/* 모바일: InputGroup inline */}
      <div className="md:hidden flex flex-col gap-1">
        <InputGroup className="h-12">
          <InputGroupInput
            placeholder={isAuthenticated ? "댓글을 입력해주세요" : "로그인 후 작성 가능합니다"}
            className="p-5 placeholder:font-medium text-[14px]"
            value={commentText || ""}
            onChange={onTextChange}
            disabled={!isAuthenticated}
            maxLength={maxLength}
          />
          <InputGroupAddon align="inline-end">
            <Button
              onClick={onSubmit}
              disabled={!isAuthenticated || !(commentText || "").trim() || isPending}
            >
              {isPending ? "등록중..." : "등록"}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <div className="flex justify-end">
          <Chip className="text-black-40 text-[12px]">
            {(commentText || "").length}/{maxLength}
          </Chip>
        </div>
      </div>
    </>
  );
};

export default CommentForm;
