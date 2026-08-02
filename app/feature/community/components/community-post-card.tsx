import Link from "next/link";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
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
  const { imageCount, thumbnails } = post;
  const hasImages = imageCount > 0;
  const firstThumbnailUrl = getImageUrl(thumbnails[0]?.filePath);
  const avatarUrl = getImageUrl(post.author.profilePath);
  const visibleGridSlots = Math.min(imageCount, 4);
  const gridOverflow = imageCount > 4 ? imageCount - 4 : 0;

  return (
    <Link href={`/community/${post.id}`} className="block group">
      {/* Desktop (xl+): flat row */}
      <div
        className={cn(
          "hidden xl:block py-5 border-b border-black/10",
          className,
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-black/15 flex-shrink-0 overflow-hidden">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-[14px] font-semibold tracking-[-0.04em] text-black leading-tight">
              {post.author.nickname}
            </p>
            <p className="text-[12px] text-black/40 font-medium leading-tight mt-0.5">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold leading-[1.4] tracking-[-0.04em] text-black group-hover:text-main transition-colors line-clamp-2">
              {post.category && (
                <span className="text-main">[{post.category.name}] </span>
              )}
              {post.title}
            </p>
          </div>

          {hasImages && (
            <div className="relative flex-shrink-0 w-[96px] h-[96px] rounded-[4px] bg-black/10 overflow-hidden">
              {firstThumbnailUrl && (
                <img
                  src={firstThumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
              {imageCount > 1 && (
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                  +{imageCount - 1}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <span className="flex items-center gap-1 text-[13px] font-medium text-black/50">
            <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1 text-[13px] font-medium text-black/50">
            <ThumbsDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            {post.dislikeCount}
          </span>
          <span className="flex items-center gap-1 text-[13px] font-medium text-black/50">
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            {post.commentCount}
          </span>
        </div>
      </div>

      {/* Mobile / Tablet (<xl): card */}
      <div
        className={cn(
          "xl:hidden bg-white rounded-[6px] shadow-[0_4px_20px_0_rgba(0,0,0,0.04)] p-4 md:p-5 mb-3",
          className,
        )}
      >
        {/* 작성자 (좌) + 시간 (우) */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-black/15 flex-shrink-0 overflow-hidden">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-[14px] font-semibold tracking-[-0.04em] text-black leading-none">
              {post.author.nickname}
            </p>
          </div>
          <p className="text-[12px] text-black/40 font-medium leading-none">
            {timeAgo(post.createdAt)}
          </p>
        </div>

        {/* 제목 */}
        <p className="text-[16px] md:text-[17px] font-bold leading-[1.4] tracking-[-0.04em] text-black group-hover:text-main transition-colors line-clamp-2 mb-3">
          {post.category && (
            <span className="text-main">[{post.category.name}] </span>
          )}
          {post.title}
        </p>

        {/* 이미지 2x2 그리드 — thumbnails 배열 최대 4장, imageCount > 4이면 4번째 슬롯에 +N 오버레이 */}
        {hasImages && (
          <div className="grid grid-cols-2 gap-1 mb-3">
            {Array.from({ length: visibleGridSlots }).map((_, idx) => {
              const isOverflowSlot = idx === 3 && gridOverflow > 0;
              const slotUrl = getImageUrl(thumbnails[idx]?.filePath);
              return (
                <div
                  key={thumbnails[idx]?.id ?? idx}
                  className="relative aspect-square rounded-[4px] bg-black/10 overflow-hidden"
                >
                  {slotUrl && (
                    <img
                      src={slotUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isOverflowSlot && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-[14px] font-bold">
                        +{gridOverflow}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 반응 카운트 */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[13px] font-medium text-black/50">
            <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1 text-[13px] font-medium text-black/50">
            <ThumbsDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            {post.dislikeCount}
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
