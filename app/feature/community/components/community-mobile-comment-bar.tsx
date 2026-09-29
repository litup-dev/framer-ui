"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api";
import { useLoginRequired } from "../hooks/use-login-required";
import { MentionInput } from "./mention-input";
import type { MentionableUser } from "../types";

const MAX_LENGTH = 200;

function visibleLength(text: string): number {
  return text.replace(/@\[([^\]]+)\]\(\d+\)/g, "@$1").length;
}

interface CommunityMobileCommentBarProps {
  postId: number;
  mentionableUsers?: MentionableUser[];
}

export function CommunityMobileCommentBar({
  postId,
  mentionableUsers = [],
}: CommunityMobileCommentBarProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated, showLoginModal } = useLoginRequired();

  const [content, setContent] = useState("");
  const [mentionedUserIds, setMentionedUserIds] = useState<number[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createComment(postId, {
        content: content.trim(),
        mentionedUserIds: Array.from(new Set(mentionedUserIds)),
      }),
    onSuccess: () => {
      setContent("");
      setMentionedUserIds([]);
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
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
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-black/10">
      <form onSubmit={handleSubmit} className="flex items-end">
        <div className="flex-1 px-4 py-6">
          <MentionInput
            value={content}
            onChange={handleChange}
            mentionableUsers={mentionableUsers}
            placeholder="댓글을 입력하세요."
            onFocus={handleFocus}
            ariaLabel="댓글 입력"
            className="text-[14px] font-medium tracking-[-0.02em] text-black leading-[1.5] max-h-[120px] overflow-y-auto"
          />
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isPending}
          className="flex items-center justify-center w-16 h-16 bg-main text-white flex-shrink-0 disabled:opacity-40 transition-opacity"
          aria-label="댓글 등록"
        >
          <Image
            src="/images/comments_right_arrow.svg"
            alt=""
            width={24}
            height={20}
          />
        </button>
      </form>
    </div>
  );
}
