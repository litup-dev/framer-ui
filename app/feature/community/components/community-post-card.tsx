import Link from "next/link";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostItem } from "../types";

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

interface CommunityPostCardProps {
  post: PostItem;
  className?: string;
}

export function CommunityPostCard({ post, className }: CommunityPostCardProps) {
  return (
    <Link href={`/community/${post.id}`} className="block group">
      <div className={cn("py-5 border-b border-black/10", className)}>
        {/* 작성자 + 시간 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-black/15 flex-shrink-0" />
          <div>
            <p className="text-[14px] font-semibold tracking-[-0.04em] text-black leading-tight">
              {post.author.nickname}
            </p>
            <p className="text-[12px] text-black/40 font-medium leading-tight mt-0.5">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* 제목 + 썸네일 */}
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[16px] md:text-[17px] font-bold leading-[1.4] tracking-[-0.04em] text-black group-hover:text-main transition-colors line-clamp-2 mb-2">
              {post.category && (
                <span className="text-black/50 group-hover:text-main/50">[{post.category.name}] </span>
              )}
              {post.title}
            </p>
            {post.contentPreview && (
              <p className="text-[13px] md:text-[14px] font-medium leading-[1.5] tracking-[-0.04em] text-black/40 line-clamp-2">
                {post.contentPreview}
              </p>
            )}
          </div>

          {post.thumbnail && (
            <div className="relative flex-shrink-0 w-[80px] h-[80px] md:w-[96px] md:h-[96px] rounded-[4px] bg-black/10 overflow-hidden">
              <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
              {post.imageCount && post.imageCount > 1 && (
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                  +{post.imageCount - 1}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 반응 카운트 */}
        <div className="flex items-center gap-3 mt-3">
          <span className="flex items-center gap-1 text-[13px] font-medium text-black/50">
            <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1 text-[13px] font-medium text-black/50">
            <ThumbsDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            {post.dislikeCount ?? 0}
          </span>
          <span className="flex items-center gap-1 text-[13px] font-medium text-black/50">
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            {post.commentCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
