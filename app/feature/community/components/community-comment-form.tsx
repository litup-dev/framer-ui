"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { useRouter, usePathname } from "next/navigation";
import { saveReturnUrl } from "@/lib/login-utils";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 200;

interface CommunityCommentFormProps {
  postId: number;
  parentId?: number;
  replyTo?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

export function CommunityCommentForm({
  postId,
  parentId,
  replyTo,
  onSuccess,
  onCancel,
  compact = false,
}: CommunityCommentFormProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const [content, setContent] = useState(replyTo ? `@${replyTo} ` : "");

  const { mutate, isPending } = useMutation({
    mutationFn: () => createComment(postId, { content: content.trim(), parentId }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      onSuccess?.();
    },
  });

  const handleFocus = () => {
    if (!isAuthenticated) {
      saveReturnUrl(pathname);
      router.push("/login");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;
    if (!isAuthenticated) {
      saveReturnUrl(pathname);
      router.push("/login");
      return;
    }
    mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "border border-black/15 rounded-[4px]",
        compact ? "border-black/10 bg-black/[0.01]" : "",
      )}
    >
      <div className="flex gap-3 p-3.5 pb-2">
        {/* 아바타 */}
        <div className="w-8 h-8 rounded-full bg-black/15 flex-shrink-0 mt-0.5" />

        {/* 텍스트 영역 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={handleFocus}
          placeholder="내용을 입력해 주세요."
          rows={compact ? 2 : 3}
          maxLength={MAX_LENGTH}
          className="flex-1 resize-none bg-transparent text-[14px] font-medium tracking-[-0.02em] text-black placeholder:text-black/30 outline-none leading-[1.6]"
        />
      </div>

      {/* 하단 카운터 + 버튼 */}
      <div className="flex items-center justify-between px-3.5 pb-3">
        <span className="text-[12px] text-black/30 font-medium">
          {content.length}/{MAX_LENGTH}
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
