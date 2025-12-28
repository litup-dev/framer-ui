"use client";

import { Ellipsis, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Description, Title } from "@/components/shared/typography";

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
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  isOwner?: boolean;
}

export default function PerformanceCommentItem({
  comment,
  userNickname,
  userProfilePath,
  onEdit,
  onDelete,
  isOwner = true,
}: PerformanceCommentItemProps) {
  const getTimeAgo = (dateStr: string) => {
    // TODO: 실제 시간 계산 로직 구현
    return dateStr;
  };

  return (
    <div className="h-[170px] bg-[#F5F5F5]/60 rounded p-6 flex flex-col">
      {/* 상단: 프로필 + 닉네임 + 시간 + ... 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
            <AvatarImage src={userProfilePath} alt={userNickname} />
            <AvatarFallback className="bg-muted text-black text-xs">
              {userNickname?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Title className="text-[14px] md:text-[16px]">{userNickname}</Title>
          <Description className="text-[12px] md:text-[14px] text-muted-foreground">{getTimeAgo(comment.createdAt)}</Description>
        </div>
        {isOwner && (
          <button className="p-1">
            <Ellipsis className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}
      </div>

      {/* 코멘트 내용 */}
      <p className="text-[14px] md:text-[16px] mb-6 flex-1">
        {comment.content}
      </p>

      {/* 좋아요 */}
      <div className="flex items-center gap-1.5">
        <Heart
          className={`w-6 h-6 ${
            comment.isLiked
              ? "fill-main text-main"
              : "fill-none text-[#202020]/20"
          }`}
        />
        <Description className="text-[12px] md:text-[14px]">{comment.likeCount}</Description>
      </div>
    </div>
  );
}
