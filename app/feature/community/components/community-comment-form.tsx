"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api";
import { useLoginRequired } from "../hooks/use-login-required";
import { MentionInput } from "./mention-input";
import { cn } from "@/lib/utils";
import type { MentionableUser } from "../types";

const MAX_LENGTH = 200;

interface CommunityCommentFormProps {
  postId: number;
  parentId?: number;
  replyToNickname?: string;
  replyToUserId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  compact?: boolean;
  mentionableUsers?: MentionableUser[];
}

// 보이는 길이 = @[nick](id) 을 @nick 로 치환한 길이
function visibleLength(text: string): number {
  return text.replace(/@\[([^\]]+)\]\(\d+\)/g, "@$1").length;
}

export function CommunityCommentForm({
  postId,
  parentId,
  replyToNickname,
  replyToUserId,
  onSuccess,
  onCancel,
  compact = false,
  mentionableUsers = [],
}: CommunityCommentFormProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated, showLoginModal } = useLoginRequired();

  const initial =
    replyToNickname && replyToUserId
      ? `@[${replyToNickname}](${replyToUserId}) `
      : "";
  const initialIds = replyToUserId ? [replyToUserId] : [];

  const [content, setContent] = useState(initial);
  const [mentionedUserIds, setMentionedUserIds] = useState<number[]>(initialIds);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createComment(postId, {
        content: content.trim(),
        parentId,
        mentionedUserIds: Array.from(new Set(mentionedUserIds)),
      }),
    onSuccess: () => {
      setContent("");
      setMentionedUserIds([]);
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
        "relative bg-white border border-black/15 rounded-[4px]",
        compact && "border-black/10",
      )}
    >
      <div className="flex gap-3 p-3.5 pb-2">
        <div className="w-8 h-8 rounded-full bg-black/15 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <MentionInput
            value={content}
            onChange={handleChange}
            mentionableUsers={mentionableUsers}
            placeholder="내용을 입력해 주세요."
            onFocus={handleFocus}
            ariaLabel="댓글 입력"
            className={cn(
              "text-[14px] font-medium tracking-[-0.02em] text-black leading-[1.6]",
              compact ? "min-h-[44px]" : "min-h-[66px]",
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-3.5 pb-3">
        <span className="text-[12px] text-black/30 font-medium">
          {visibleLength(content)}/{MAX_LENGTH}
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-1.5 text-[13px] font-semibold text-black/50 hover:text-black transition-colors"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim() || isPending}
            className="px-4 py-1.5 rounded-[3px] bg-main text-white text-[13px] font-bold disabled:opacity-30 transition-opacity"
          >
            등록
          </button>
        </div>
      </div>
    </form>
  );
}
