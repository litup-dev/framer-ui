"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Trash2, Pencil, Heart, MessageCircle, CornerDownRight } from "lucide-react";
import { deleteComment, toggleCommentLike } from "../api";
import { CommunityCommentForm } from "./community-comment-form";
import { useLoginRequired } from "../hooks/use-login-required";
import { cn, getImageUrl, formatRelativeTime } from "@/lib/utils";
import type { Comment, MentionableUser } from "../types";

function formatFull(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${String(d.getFullYear()).slice(2)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// @[nickname](userId) 형식과 legacy @nickname 둘 다 지원
function renderContentWithMentions(content: string) {
  const pattern = /(@\[[^\]]+\]\(\d+\)|@[^\s@\[]+)/g;
  const parts = content.split(pattern);
  return parts.map((part, i) => {
    if (part.startsWith("@[")) {
      const m = part.match(/@\[([^\]]+)\]\(\d+\)/);
      const nick = m ? m[1] : part;
      return (
        <span key={i} className="text-main font-semibold">
          @{nick}
        </span>
      );
    }
    if (part.startsWith("@")) {
      return (
        <span key={i} className="text-main font-semibold">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface CommunityCommentItemProps {
  comment: Comment;
  postId: number;
  isReply?: boolean;
  mentionableUsers?: MentionableUser[];
}

function CommentAvatar({ profilePath }: { profilePath?: string | null }) {
  const src = getImageUrl(profilePath);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  return (
    <Image
      src="/images/user/user-avatar.svg"
      alt=""
      width={28}
      height={28}
      className="w-7 h-7 rounded-full flex-shrink-0"
    />
  );
}

export function CommunityCommentItem({
  comment,
  postId,
  isReply = false,
  mentionableUsers,
}: CommunityCommentItemProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated, showLoginModal } = useLoginRequired();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [likeState, setLikeState] = useState({
    isLiked: comment.isLiked,
    likeCount: comment.likeCount,
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => toggleCommentLike(comment.id),
    onMutate: () => {
      const prev = likeState;
      setLikeState((s) => ({
        isLiked: !s.isLiked,
        likeCount: s.isLiked ? s.likeCount - 1 : s.likeCount + 1,
      }));
      return prev;
    },
    onSuccess: (res) => {
      setLikeState({
        isLiked: res.data.isLiked,
        likeCount: res.data.likeCount,
      });
    },
    onError: (_e, _v, prev) => {
      if (prev) setLikeState(prev);
    },
  });

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    setShowReplyForm((v) => !v);
  };

  const handleHeartClick = () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    toggleLike();
  };

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });

  if (comment.isDeleted) {
    return (
      <div className={cn("py-4 bg-white rounded-[6px] mb-3 md:bg-transparent md:rounded-none md:mb-0 md:border-b md:border-black/10", isReply && "pl-6 md:pl-10")}>
        <p className="text-[13px] text-black/30 italic px-3.5 md:px-0">삭제된 댓글입니다.</p>
        {comment.replies?.map((reply) => (
          <CommunityCommentItem
            key={reply.id}
            comment={reply}
            postId={postId}
            isReply
            mentionableUsers={mentionableUsers}
          />
        ))}
      </div>
    );
  }

  const cardClass =
    "bg-white rounded-[6px] p-3.5 md:bg-transparent md:rounded-none md:border-b md:border-black/10 md:p-0 md:py-4";

  const wrapperClass = isReply
    ? "flex items-start gap-2 pl-4 md:pl-6 mt-3 md:mt-2"
    : "mb-3 md:mb-0";

  return (
    <div className={wrapperClass}>
      {isReply && (
        <CornerDownRight
          className="w-3.5 h-3.5 mt-3.5 text-black/30 flex-shrink-0"
          strokeWidth={1.5}
        />
      )}

      <div className="flex-1 min-w-0">
        <div className={cardClass}>
          {/* 헤더: 아바타+닉네임(위)+날짜(아래) | 우측 ... */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <CommentAvatar profilePath={comment.author?.profilePath} />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold tracking-[-0.04em] text-black leading-tight truncate">
                  {comment.author?.nickname ?? "알 수 없음"}
                </p>
                {/* 날짜: xl 미만은 닉네임 아래 상대 시간, xl 이상은 하단 액션 줄의 절대 시간 사용 */}
                <p className="xl:hidden text-[11px] text-black/40 font-medium leading-tight mt-0.5">
                  {formatRelativeTime(
                    comment.updatedAt && comment.updatedAt !== comment.createdAt
                      ? comment.updatedAt
                      : comment.createdAt,
                    !!(comment.updatedAt && comment.updatedAt !== comment.createdAt),
                  )}
                </p>
              </div>
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="p-1 text-black/30 hover:text-black/60 transition-colors"
                aria-label="더보기"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-black/10 rounded-[4px] shadow-sm z-10 min-w-[100px]">
                  {comment.isMine ? (
                    <>
                      <button
                        onClick={() => { setIsEditing(true); setShowMenu(false); }}
                        className="flex items-center gap-1.5 w-full px-3 py-2 text-[13px] font-semibold text-black/60 hover:bg-black/5 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        수정
                      </button>
                      <button
                        onClick={() => { remove(); setShowMenu(false); }}
                        disabled={isDeleting}
                        className="flex items-center gap-1.5 w-full px-3 py-2 text-[13px] font-semibold text-red-400 hover:bg-black/5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        삭제
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (!isAuthenticated) {
                          showLoginModal();
                          return;
                        }
                        alert("신고 기능은 준비 중입니다.");
                      }}
                      className="flex items-center gap-1.5 w-full px-3 py-2 text-[13px] font-semibold text-black/60 hover:bg-black/5 transition-colors"
                    >
                      신고
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <CommunityCommentForm
              postId={postId}
              commentId={comment.id}
              initialContent={comment.content}
              compact
              mentionableUsers={mentionableUsers}
              onSuccess={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              {/* 본문 */}
              <p className="text-[14px] leading-[1.6] tracking-[-0.02em] text-black/80 whitespace-pre-wrap mb-3">
                {renderContentWithMentions(comment.content)}
              </p>

              {/* 하단: 하트 + 답글달기 */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleHeartClick}
                  className={cn(
                    "flex items-center gap-1 text-[12px] font-semibold transition-colors",
                    likeState.isLiked
                      ? "text-red-500"
                      : "text-black/40 hover:text-red-400",
                  )}
                >
                  <Heart
                    className="w-3.5 h-3.5"
                    strokeWidth={1.5}
                    fill={likeState.isLiked ? "currentColor" : "none"}
                  />
                  {likeState.likeCount}
                </button>

                {!isReply && (
                  <button
                    onClick={handleReplyClick}
                    className="flex items-center gap-1 text-[12px] font-semibold text-black/40 hover:text-black/70 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                    답글달기
                  </button>
                )}

                {/* 날짜 (절대 시간, xl 이상 전용) */}
                <p className="hidden xl:block ml-auto text-[12px] text-black/40 font-medium">
                  <span>{formatFull(comment.createdAt)} 작성</span>
                  {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                    <span className="ml-2">{formatFull(comment.updatedAt)} 수정됨</span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        {/* 답글 폼 */}
        {showReplyForm && !isReply && (
          <div className="mt-3 pl-4 md:pl-6">
            <CommunityCommentForm
              postId={postId}
              parentId={comment.id}
              replyToNickname={comment.author?.nickname}
              replyToUserId={comment.author?.id}
              compact
              mentionableUsers={mentionableUsers}
              onSuccess={() => setShowReplyForm(false)}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {/* 대댓글 목록 */}
        {comment.replies?.map((reply) => (
          <CommunityCommentItem
            key={reply.id}
            comment={reply}
            postId={postId}
            isReply
            mentionableUsers={mentionableUsers}
          />
        ))}
      </div>
    </div>
  );
}
