"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, updateComment } from "../api";
import { useLoginRequired } from "../hooks/use-login-required";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { MentionInput } from "./mention-input";
import { cn, getImageUrl } from "@/lib/utils";
import type { MentionableUser } from "../types";

const MAX_LENGTH = 200;

interface CommunityCommentFormProps {
  postId: number;
  parentId?: number;
  replyToNickname?: string;
  replyToUserId?: number;
  commentId?: number;
  initialContent?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  compact?: boolean;
  mentionableUsers?: MentionableUser[];
}

// 보이는 길이 = @[nick](id) 을 @nick 로 치환한 길이
function visibleLength(text: string): number {
  return text.replace(/@\[([^\]]+)\]\(\d+\)/g, "@$1").length;
}

function parseMentionIds(text: string): number[] {
  const ids: number[] = [];
  const re = /@\[[^\]]+\]\((\d+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) ids.push(Number(m[1]));
  return ids;
}

export function CommunityCommentForm({
  postId,
  parentId,
  replyToNickname,
  replyToUserId,
  commentId,
  initialContent,
  onSuccess,
  onCancel,
  compact = false,
  mentionableUsers = [],
}: CommunityCommentFormProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated, showLoginModal } = useLoginRequired();
  const { user } = useCurrentUser();
  const avatarUrl = getImageUrl(user?.profilePath ?? null);

  const isEdit = commentId !== undefined;
  // 답글 작성 시엔 프로필 옆에 내 닉네임을 보여준 뒤 그 아래로 입력창 (댓글/수정과 구분)
  const showNickname = !isEdit && parentId !== undefined;

  const initial = isEdit
    ? initialContent ?? ""
    : replyToNickname && replyToUserId
      ? `@[${replyToNickname}](${replyToUserId}) `
      : "";
  const initialIds = isEdit
    ? parseMentionIds(initialContent ?? "")
    : replyToUserId
      ? [replyToUserId]
      : [];

  const [content, setContent] = useState(initial);
  const [mentionedUserIds, setMentionedUserIds] = useState<number[]>(initialIds);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      isEdit
        ? updateComment(commentId, content.trim(), Array.from(new Set(mentionedUserIds)))
        : createComment(postId, {
            content: content.trim(),
            parentId,
            mentionedUserIds: Array.from(new Set(mentionedUserIds)),
          }),
    onSuccess: () => {
      if (!isEdit) {
        setContent("");
        setMentionedUserIds([]);
      }
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      onSuccess?.();
    },
  });

  const handleFocus = () => {
    if (!isAuthenticated) {
      showLoginModal();
    }
  };

  const handleChange = (v: string, ids: number[]) => {
    if (visibleLength(v) > MAX_LENGTH) return;
    setContent(v);
    setMentionedUserIds(ids);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative bg-white border border-black/20 rounded-[4px]",
        compact && "border-black/10",
      )}
    >
      <div className="flex gap-3 p-3.5 pb-2">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
          />
        ) : (
          <Image
            src="/images/user/user-avatar.svg"
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
          />
        )}
        <div className="flex-1 min-w-0">
          {showNickname && (
            <p className="text-[14px] xl:text-[16px] font-semibold tracking-[-0.04em] text-black leading-tight mb-1">
              {user?.nickname}
            </p>
          )}
          <MentionInput
            value={content}
            onChange={handleChange}
            mentionableUsers={mentionableUsers}
            placeholder="내용을 입력해 주세요."
            onFocus={handleFocus}
            ariaLabel="댓글 입력"
            className={cn(
              "text-[14px] xl:text-[16px] font-medium xl:font-normal tracking-[-0.02em] xl:tracking-[-0.04em] text-black leading-[1.6]",
              compact ? "min-h-[44px]" : "min-h-[66px]",
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-3.5 pb-3">
        <span className="text-[12px] xl:text-[14px] text-black/30 xl:text-black/40 font-medium">
          {visibleLength(content)}/{MAX_LENGTH}
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 xl:px-4 py-1.5 xl:py-3 text-[13px] xl:text-[14px] font-semibold text-black/50 xl:text-black/40 hover:text-black transition-colors"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim() || isPending}
            className={cn(
              "px-4 py-1.5 xl:py-3 rounded-[3px] xl:rounded-[4px] text-[13px] xl:text-[14px] font-bold transition-colors",
              content.trim()
                ? "bg-main text-white"
                : "bg-black/10 text-black/40",
            )}
          >
            {isEdit ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </form>
  );
}
