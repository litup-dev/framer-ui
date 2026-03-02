"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Description, Title, Chip, Subtitle } from "@/components/shared/typography";
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
  userPublicId?: string;
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
  userPublicId,
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
  const router = useRouter();
  const [showMoreButton, setShowMoreButton] = useState(false);

  useEffect(() => {
    const lineCount = (comment.content.match(/\n/g) || []).length + 1;
    setShowMoreButton(lineCount > 3);
  }, [comment.content]);

  const formatRelativeTime = (dateString: string, isEdited: boolean = false) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    let timeStr;
    if (diffInMinutes < 1) {
      timeStr = "방금 전";
    } else {
      timeStr = formatDistanceToNow(date, {
        addSuffix: true,
        locale: ko,
      });
    }
    return isEdited ? `${timeStr} (수정됨)` : timeStr;
  };

  // 수정 상태 UI (아바타/닉네임 제거, 회색 배경 유지)
  if (isEditing && tabType === "myComments") {
    return (
      <div className="bg-[#202020]/[0.04] px-6 py-6 md:px-10 md:py-10">
        <div className="flex items-center justify-between mb-4">
          <Description className="text-black-40 text-[12px] md:text-[14px] 2xl:text-[16px] tracking-[-0.04em]">
            {formatRelativeTime(comment.createdAt)}
          </Description>
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
          placeholder="댓글을 입력해주세요."
          className="h-[70px] md:h-[100px] resize-none overflow-y-auto rounded-[6px] px-4 py-[13px] text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] 2xl:text-[18px] font-medium tracking-[-0.08em] lg:tracking-[-0.04em] leading-[160%] border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={editingText}
          onChange={onEditTextChange}
          maxLength={maxLength}
        />

        <div className="flex justify-between items-start mt-6 md:mt-10">
          <Chip className="text-black-40 text-[12px] md:text-[14px] lg:text-[16px] font-medium tracking-[-0.08em] md:tracking-[-0.04em]">
            {editingText.length}/{maxLength}
          </Chip>
          <Button
            onClick={onEditSubmit}
            disabled={!editingText.trim() || isUpdating}
            className="bg-white text-[#202020] hover:bg-white/80 border border-[#202020]/10 w-[56px] h-[34px] px-4 py-2.5 xl:w-16 xl:h-10 xl:px-[18px] xl:py-3"
          >
            {isUpdating ? "등록중..." : "등록"}
          </Button>
        </div>
      </div>
    );
  }

  // 일반 상태 UI (회색 배경 유지)
  return (
    <div className="min-h-[170px] bg-[#F5F5F5]/60 rounded p-6 flex flex-col">
      {/* 상단: 아바타/닉네임(좋아요한 코멘트만) + 시간 + ... 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {tabType === "likedComments" && (
            <>
              <Avatar className="w-6 h-6 md:w-8 md:h-8 2xl:w-10 2xl:h-10">
                <AvatarImage src={getImageUrl(userProfilePath) || undefined} alt={userNickname} />
                <AvatarFallback>{userNickname[0]}</AvatarFallback>
              </Avatar>
              <Subtitle
                className="text-[14px] md:text-[16px] 2xl:text-[18px] cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => userPublicId && router.push(`/user/${userPublicId}`)}
              >
                {userNickname}
              </Subtitle>
            </>
          )}
          <Description className="text-black-40 text-[12px] md:text-[14px] 2xl:text-[16px] tracking-[-0.04em]">
            {formatRelativeTime(comment.createdAt)}
          </Description>
        </div>

        {/* 탭 타입에 따라 다른 메뉴 보여주기 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer">
              <Image src="/images/ellipsis.svg" alt="menu" width={20} height={20} className="w-5 h-5 md:w-6 md:h-6" />
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
          className={`tracking-[0] font-normal text-black-80 text-[14px] md:text-[16px] 2xl:text-[18px] whitespace-pre-wrap leading-[160%] ${
            !isExpanded && showMoreButton ? "line-clamp-3" : ""
          }`}
        >
          {comment.content}
        </p>
        {showMoreButton && (
          <div className="mt-3 md:mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="h-auto p-0 text-[12px] md:text-[14px] text-black-60 hover:text-black-80"
            >
              {isExpanded ? "접기" : "더보기"}
            </Button>
          </div>
        )}
      </div>

      {/* 좋아요 */}
      <div className="mt-6">
        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={onLikeClick}
        >
          <Image
            src={comment.isLiked ? "/images/performance-detail/comment-like_active.svg" : "/images/performance-detail/comment-like_inactive.svg"}
            alt="like"
            width={24}
            height={24}
            className="w-6 h-6 flex-shrink-0"
          />
          <Description className="font-medium text-[12px] md:text-[14px] 2xl:text-[16px] tracking-[-0.04em]">
            {comment.likeCount}
          </Description>
        </div>
      </div>
    </div>
  );
}
