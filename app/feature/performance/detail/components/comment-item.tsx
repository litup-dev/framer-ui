"use client";

import { useState, useEffect, useRef } from "react";
import { Chip, Subtitle, Description } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useReportModalStore } from "@/store/report-modal-store";
import { useCommonModalStore } from "@/store/common-modal-store";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { useReportContent } from "../query-options";
import { REPORT_CATEGORIES } from "@/app/shared/constants";
import { getImageUrl } from "@/lib/utils";

interface CommentItemProps {
  comment: any;
  isMyComment: boolean;
  isEditing: boolean;
  editingText: string;
  maxLength: number;
  onEditClick: () => void;
  onEditCancel: () => void;
  onEditSubmit: () => void;
  onEditTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDeleteClick: () => void;
  onLikeClick: () => void;
  isUpdating: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const CommentItem = ({
  comment,
  isMyComment,
  isEditing,
  editingText,
  maxLength,
  onEditClick,
  onEditCancel,
  onEditSubmit,
  onEditTextChange,
  onDeleteClick,
  onLikeClick,
  isUpdating,
  isExpanded,
  onToggleExpand,
}: CommentItemProps) => {
  const router = useRouter();
  const { openModal: openReportModal } = useReportModalStore();
  const { openModal: openCommonModal } = useCommonModalStore();
  const { isAuthenticated } = useUserStore();
  const reportMutation = useReportContent();
  const [showMoreButton, setShowMoreButton] = useState(false);

  useEffect(() => {
    const lineCount = (comment.content.match(/\n/g) || []).length + 1;
    setShowMoreButton(lineCount >= 3);
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

  const handleReportClick = () => {
    if (!isAuthenticated) {
      openCommonModal({
        description: "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
        confirmButton: {
          label: "확인",
          onClick: () => router.push("/login"),
        },
        cancelButton: {
          label: "취소",
          onClick: () => {},
        },
      });
      return;
    }

    openReportModal({
      targetContent: (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={getImageUrl(comment.user.profile_path) || undefined} alt={comment.user.nickname} />
              <AvatarFallback>{comment.user.nickname[0]}</AvatarFallback>
            </Avatar>
            <Subtitle className="text-[14px]">{comment.user.nickname}</Subtitle>
            <Description className="text-black-40 text-[12px]">
              {formatRelativeTime(comment.updatedAt || comment.createdAt, !!comment.updatedAt)}
            </Description>
          </div>
          <Chip className="font-normal text-black-80 text-[14px]">
            {comment.content}
          </Chip>
        </div>
      ),
      typeId: 1, // 댓글 타입 ID
      entityId: comment.id,
      onSubmit: (categoryId: string, content: string) => {
        const categoryIndex = REPORT_CATEGORIES.findIndex((cat) => cat.id === categoryId);

        reportMutation.mutate({
          typeId: 1,
          categoryId: categoryIndex + 1, // 1-based index
          entityId: comment.id,
          content,
        }, {
          onSuccess: () => {
            alert("신고가 접수되었습니다.");
          },
          onError: () => {
            alert("신고 접수에 실패했습니다.");
          },
        });
      },
    });
  };

  if (isEditing) {
    return (
      <>
        <Separator className="mb-6" />
        <div className="bg-[#202020]/[0.04] px-6 py-6 md:px-10 md:py-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6 md:w-8 md:h-8 2xl:w-10 2xl:h-10">
                <AvatarImage src={getImageUrl(comment.user.profile_path) || undefined} alt={comment.user.nickname} />
                <AvatarFallback>{comment.user.nickname[0]}</AvatarFallback>
              </Avatar>
              <Subtitle
                className="text-[14px] md:text-[16px] 2xl:text-[18px] cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => router.push(`/user/${comment.user.publicId}`)}
              >
                {comment.user.nickname}
              </Subtitle>
              <Description className="text-black-40 text-[12px] md:text-[14px] 2xl:text-[16px]">
                {formatRelativeTime(comment.updatedAt || comment.createdAt, !!comment.updatedAt)}
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
        <Separator className="mt-6" />
      </>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 md:w-8 md:h-8 2xl:w-10 2xl:h-10">
            <AvatarImage src={getImageUrl(comment.user.profile_path) || undefined} alt={comment.user.nickname} />
            <AvatarFallback>{comment.user.nickname[0]}</AvatarFallback>
          </Avatar>
          <Subtitle
            className="text-[14px] md:text-[16px] 2xl:text-[18px] cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => router.push(`/user/${comment.user.publicId}`)}
          >
            {comment.user.nickname}
          </Subtitle>
          <Description className="text-black-40 text-[12px] md:text-[14px] 2xl:text-[16px]">
            {formatRelativeTime(comment.updatedAt || comment.createdAt, !!comment.updatedAt)}
          </Description>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer">
              <Image src="/images/ellipsis.svg" alt="menu" width={20} height={20} className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isMyComment ? (
              <>
                <DropdownMenuItem onClick={onEditClick}>
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onDeleteClick}
                >
                  삭제하기
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={handleReportClick}>
                신고하기
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 md:mt-4">
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
          <Description className="font-medium text-[12px] md:text-[14px] 2xl:text-[16px]">
            {comment.likeCount}
          </Description>
        </div>
      </div>

      <Separator className="mt-6" />
    </div>
  );
};

export default CommentItem;
