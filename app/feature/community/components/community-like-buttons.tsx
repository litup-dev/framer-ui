"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { toggleLike } from "../api";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { useRouter, usePathname } from "next/navigation";
import { saveReturnUrl } from "@/lib/login-utils";
import { cn } from "@/lib/utils";
import type { LikeType } from "../types";

interface CommunityLikeButtonsProps {
  postId: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  myLikeType: LikeType | null;
}

export function CommunityLikeButtons({
  postId,
  likeCount,
  dislikeCount,
  commentCount,
  myLikeType: initialMyLikeType,
}: CommunityLikeButtonsProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  const [optimistic, setOptimistic] = useState({
    myLikeType: initialMyLikeType,
    likeCount,
    dislikeCount,
  });

  const { mutate } = useMutation({
    mutationFn: (likeType: LikeType) => toggleLike(postId, likeType),
    onMutate: (likeType) => {
      const prev = { ...optimistic };
      const isSame = optimistic.myLikeType === likeType;
      if (isSame) {
        setOptimistic((s) => ({
          myLikeType: null,
          likeCount: likeType === "LIKE" ? s.likeCount - 1 : s.likeCount,
          dislikeCount: likeType === "DISLIKE" ? s.dislikeCount - 1 : s.dislikeCount,
        }));
      } else {
        setOptimistic((s) => ({
          myLikeType: likeType,
          likeCount: likeType === "LIKE" ? s.likeCount + 1 : s.myLikeType === "LIKE" ? s.likeCount - 1 : s.likeCount,
          dislikeCount: likeType === "DISLIKE" ? s.dislikeCount + 1 : s.myLikeType === "DISLIKE" ? s.dislikeCount - 1 : s.dislikeCount,
        }));
      }
      return prev;
    },
    onSuccess: (data) => {
      setOptimistic({
        myLikeType: data.data.myLikeType as LikeType | null,
        likeCount: data.data.likeCount,
        dislikeCount: data.data.dislikeCount,
      });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
    onError: (_err, _vars, prev) => {
      if (prev) setOptimistic(prev);
    },
  });

  const handleLike = (likeType: LikeType) => {
    if (!isAuthenticated) {
      saveReturnUrl(pathname);
      router.push("/login");
      return;
    }
    mutate(likeType);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("링크가 복사되었습니다.");
    });
  };

  return (
    <div className="flex items-center gap-5 py-5 border-t border-b border-black/10">
      <button
        onClick={() => handleLike("LIKE")}
        className={cn(
          "flex items-center gap-1.5 text-[14px] font-semibold transition-colors",
          optimistic.myLikeType === "LIKE" ? "text-main" : "text-black/50 hover:text-black/80",
        )}
      >
        <ThumbsUp
          className="w-[18px] h-[18px]"
          strokeWidth={1.5}
          fill={optimistic.myLikeType === "LIKE" ? "currentColor" : "none"}
        />
        {optimistic.likeCount}
      </button>

      <button
        onClick={() => handleLike("DISLIKE")}
        className={cn(
          "flex items-center gap-1.5 text-[14px] font-semibold transition-colors",
          optimistic.myLikeType === "DISLIKE" ? "text-black" : "text-black/50 hover:text-black/80",
        )}
      >
        <ThumbsDown
          className="w-[18px] h-[18px]"
          strokeWidth={1.5}
          fill={optimistic.myLikeType === "DISLIKE" ? "currentColor" : "none"}
        />
        {optimistic.dislikeCount}
      </button>

      <span className="flex items-center gap-1.5 text-[14px] font-semibold text-black/50">
        <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
        {commentCount}
      </span>

      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-[14px] font-semibold text-black/50 hover:text-black/80 transition-colors ml-auto"
      >
        <Share2 className="w-[16px] h-[16px]" strokeWidth={1.5} />
        공유하기
      </button>
    </div>
  );
}
