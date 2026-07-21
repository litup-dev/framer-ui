"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Trash2, Heart, MessageCircle, CornerDownRight } from "lucide-react";
import { deleteComment } from "../api";
import { CommunityCommentForm } from "./community-comment-form";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { cn } from "@/lib/utils";
import type { Comment } from "../types";

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface CommunityCommentItemProps {
  comment: Comment;
  postId: number;
  isReply?: boolean;
}

export function CommunityCommentItem({ comment, postId, isReply = false }: CommunityCommentItemProps) {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });

  if (comment.isDeleted) {
    return (
      <div className={cn("py-4", isReply && "pl-10 md:pl-12")}>
        <p className="text-[13px] text-black/30 italic">삭제된 댓글입니다.</p>
        {comment.replies?.map((reply) => (
          <CommunityCommentItem key={reply.id} comment={reply} postId={postId} isReply />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("py-4 border-b border-black/[0.06] last:border-0", isReply && "border-0 pt-3 pb-2")}>
      <div className={cn(isReply && "flex items-start gap-2 pl-4 md:pl-6")}>
        {/* 대댓글 화살표 */}
        {isReply && (
          <CornerDownRight className="w-3.5 h-3.5 mt-1.5 text-black/30 flex-shrink-0" strokeWidth={1.5} />
        )}

        <div className="flex-1 min-w-0">
          {/* 헤더: 아바타 + 이름 + 메뉴 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-black/15 flex-shrink-0" />
              <span className="text-[14px] font-semibold tracking-[-0.04em] text-black">
                {comment.author?.nickname ?? "알 수 없음"}
              </span>
            </div>

            {comment.isMine && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  className="p-1 text-black/30 hover:text-black/60 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-black/10 rounded-[4px] shadow-sm z-10 min-w-[80px]">
                    <button
                      onClick={() => { remove(); setShowMenu(false); }}
                      disabled={isDeleting}
                      className="flex items-center gap-1.5 w-full px-3 py-2 text-[13px] font-semibold text-red-400 hover:bg-black/5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 본문 */}
          <p className="text-[14px] leading-[1.6] tracking-[-0.02em] text-black/80 whitespace-pre-wrap mb-3 pl-9">
            {comment.content}
          </p>

          {/* 하단: 좋아요 + 답글달기 + 날짜 */}
          <div className="flex items-center gap-4 pl-9">
            <button className="flex items-center gap-1 text-[12px] font-semibold text-black/40 hover:text-main transition-colors">
              <Heart className="w-3.5 h-3.5" strokeWidth={1.5} />
              0
            </button>

            {!isReply && (
              <button
                onClick={() => setShowReplyForm((v) => !v)}
                className="flex items-center gap-1 text-[12px] font-semibold text-black/40 hover:text-black/70 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                답글달기
              </button>
            )}

            <span className="text-[12px] text-black/30 font-medium ml-auto">
              {formatDate(comment.createdAt)}
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="ml-1.5">{formatDate(comment.updatedAt)} 수정됨</span>
              )}
            </span>
          </div>

          {/* 답글 폼 */}
          {showReplyForm && !isReply && (
            <div className="mt-3 pl-9">
              <CommunityCommentForm
                postId={postId}
                parentId={comment.id}
                replyTo={comment.author?.nickname}
                compact
                onSuccess={() => setShowReplyForm(false)}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* 대댓글 목록 */}
      {comment.replies?.map((reply) => (
        <CommunityCommentItem key={reply.id} comment={reply} postId={postId} isReply />
      ))}
    </div>
  );
}
