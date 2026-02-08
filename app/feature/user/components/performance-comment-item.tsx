"use client";

import { useRef, useEffect, useState } from "react";
import { Ellipsis, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Description, Title, Chip } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getImageUrl } from "@/lib/utils";

interface PerformanceComment {
  id: string;
  content: string;
  likeCount: number;
  createdAt: string;
  isLiked?: boolean;
}

interface PerformanceCommentItemProps {
  comment: PerformanceComment;
  userNickname: string;
  userProfilePath?: string;
  tabType: "myComments" | "likedComments"; // 탭 타입 추가
  isEditing?: boolean;
  editingText?: string;
  maxLength?: number;
  onEditClick?: () => void;
  onEditCancel?: () => void;
  onEditSubmit?: () => void;
  onEditTextChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDelete?: () => void;
  onReport?: () => void;
  onLikeClick?: () => void;
  isUpdating?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function PerformanceCommentItem({
  comment,
  userNickname,
  userProfilePath,
  tabType,
  isEditing = false,
  editingText = "",
  maxLength = 100,
  onEditClick,
  onEditCancel,
  onEditSubmit,
  onEditTextChange,
  onDelete,
  onReport,
  onLikeClick,
  isUpdating = false,
  isExpanded,
  onToggleExpand,
}: PerformanceCommentItemProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);

  useEffect(() => {
    const lineCount = (comment.content.match(/\n/g) || []).length + 1;
    setShowMoreButton(lineCount > 3);
  }, [comment.content]);

  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  // 수정 상태 UI (comment-item.tsx와 동일)
  if (isEditing && tabType === "myComments") {
    return (
      <div className="bg-[#202020]/[0.04] rounded p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 md:w-8 md:h-8">
              <AvatarImage src={getImageUrl(userProfilePath) || ""} alt={userNickname} />
              <AvatarFallback className="bg-muted text-black text-xs">
                {userNickname?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Title className="text-[14px] md:text-[16px]">{userNickname}</Title>
            <Description className="text-black-40 text-[12px] md:text-[14px]">
              {formatRelativeTime(comment.createdAt)}
            </Description>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditCancel}
            className="h-auto p-0 text-[14px] md:text-[16px] text-black-40"
          >
            취소
          </Button>
        </div>

        <Textarea
          placeholder="댓글을 입력해주세요"
          className="h-[100px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-white leading-[160%] tracking-[-0.04em]"
          style={{ letterSpacing: '-0.04em', lineHeight: '160%' }}
          value={editingText}
          onChange={onEditTextChange}
          maxLength={maxLength}
        />

        <div className="flex justify-between items-center">
          <Chip className="text-black-40 text-[14px]">
            {editingText.length}/{maxLength}
          </Chip>
          <Button
            onClick={onEditSubmit}
            disabled={!editingText.trim() || isUpdating}
            className="bg-white text-[#202020] hover:bg-gray-100 border border-[#202020]/10 w-[56px] h-[34px] px-4 py-2.5"
          >
            {isUpdating ? "등록중..." : "등록"}
          </Button>
        </div>
      </div>
    );
  }

  // 일반 상태 UI
  return (
    <div className="min-h-[170px] bg-[#F5F5F5]/60 rounded p-6 flex flex-col">
      {/* 상단: 프로필 + 닉네임 + 시간 + ... 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
            <AvatarImage src={getImageUrl(userProfilePath) || ""} alt={userNickname} />
            <AvatarFallback className="bg-muted text-black text-xs">
              {userNickname?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Title className="text-[14px] md:text-[16px]">{userNickname}</Title>
          <Description className="text-[12px] md:text-[14px] text-muted-foreground">
            {formatRelativeTime(comment.createdAt)}
          </Description>
        </div>

        {/* 탭 타입에 따라 다른 메뉴 보여주기 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1">
              <Ellipsis className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {tabType === "myComments" ? (
              <>
                <DropdownMenuItem onClick={onEditClick}>
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  삭제하기
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={onReport}>신고하기</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 코멘트 내용 */}
      <div className="flex-1">
        <p
          className={`text-[14px] md:text-[16px] whitespace-pre-wrap ${
            !isExpanded && showMoreButton ? "line-clamp-3" : ""
          }`}
        >
          {comment.content}
        </p>
        {showMoreButton && (
          <button
            onClick={onToggleExpand}
            className="text-sm text-black-40 hover:opacity-70 mt-3 md:mt-4 text-left"
          >
            {isExpanded ? "접기" : "더보기"}
          </button>
        )}
      </div>

      {/* 좋아요 */}
      <div
        className="flex items-center gap-1.5 cursor-pointer mt-6"
        onClick={onLikeClick}
      >
        <Heart
          fill={comment.isLiked ? "#FF491A" : "none"}
          stroke={comment.isLiked ? "#FF491A" : "black"}
          className="w-6 h-6"
        />
        <Description className="text-[12px] md:text-[14px]">
          {comment.likeCount}
        </Description>
      </div>
    </div>
  );
}
