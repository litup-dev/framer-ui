import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { cn, getImageUrl, formatRelativeTime } from "@/lib/utils";
import { extractPlainText } from "../utils/extract-plain-text";
import type { PostItem } from "../types";

function PostAuthorAvatar({
  profilePath,
  size = 28,
}: {
  profilePath: string | null;
  size?: 28 | 36;
}) {
  const sizeClass = size === 36 ? "w-9 h-9" : "w-7 h-7";
  const url = getImageUrl(profilePath);
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className={cn(sizeClass, "rounded-full object-cover flex-shrink-0")}
      />
    );
  }
  return (
    <Image
      src="/images/user/user-avatar.svg"
      alt=""
      width={size}
      height={size}
      className={cn(sizeClass, "rounded-full flex-shrink-0")}
    />
  );
}

interface CommunityPostCardProps {
  post: PostItem;
  className?: string;
}

export function CommunityPostCard({ post, className }: CommunityPostCardProps) {
  const { imageCount, thumbnails } = post;
  const hasImages = imageCount > 0;
  const firstThumbnailUrl = getImageUrl(thumbnails[0]?.filePath);
  const visibleGridSlots = Math.min(imageCount, 4);
  const gridOverflow = imageCount > 4 ? imageCount - 4 : 0;
  const contentPreview = extractPlainText(post.content);

  return (
    <Link href={`/community/${post.id}`} className="block group">
      {/* Desktop (xl+): flat row */}
      <div
        className={cn(
          "hidden xl:flex xl:flex-col gap-8 py-8 border-b border-[#d1d1d1]",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <PostAuthorAvatar profilePath={post.author.profilePath} size={36} />
          <div>
            <p className="text-[16px] font-medium tracking-[-0.04em] text-black leading-none">
              {post.author.nickname}
            </p>
            <p className="text-[14px] font-semibold tracking-[-0.04em] text-black/30 leading-none mt-1.5">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <p className="text-[24px] font-semibold leading-none tracking-[-0.04em] text-black group-hover:text-main transition-colors line-clamp-2">
              {post.category && (
                <span className="text-black/40">[{post.category.name}] </span>
              )}
              {post.title}
            </p>
            {contentPreview && (
              <p className="text-[16px] font-medium leading-[1.4] tracking-[-0.04em] text-black/40 line-clamp-2">
                {contentPreview}
              </p>
            )}
          </div>

          {hasImages && (
            <div className="relative flex-shrink-0 w-[176px] h-[220px] rounded-[4px] bg-black/10 overflow-hidden">
              {firstThumbnailUrl && (
                <img
                  src={firstThumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
              {imageCount > 1 && (
                <div className="absolute bottom-2.5 left-2.5 backdrop-blur-[2px] bg-black/40 text-white text-[14px] font-semibold tracking-[-0.04em] px-3.5 py-[7px] rounded-full">
                  +{imageCount - 1}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[16px] font-medium tracking-[-0.04em] text-black">
            <ThumbsUp className="w-6 h-6" strokeWidth={1.5} />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1 text-[16px] font-medium tracking-[-0.04em] text-black">
            <ThumbsDown className="w-6 h-6" strokeWidth={1.5} />
            {post.dislikeCount}
          </span>
          <span className="flex items-center gap-1 text-[16px] font-medium tracking-[-0.04em] text-black">
            <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
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
            <PostAuthorAvatar profilePath={post.author.profilePath} />
            <p className="text-[14px] font-semibold tracking-[-0.04em] text-black leading-none">
              {post.author.nickname}
            </p>
          </div>
          <p className="text-[12px] text-black/40 font-medium leading-none">
            {formatRelativeTime(post.createdAt)}
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
