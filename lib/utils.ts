import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * "n분 전" / "n시간 전" / "n일 전" 형태의 상대 시간 문자열로 변환
 */
export function formatRelativeTime(dateString: string, isEdited = false): string {
  const diffInMinutes = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60),
  );

  const timeStr =
    diffInMinutes < 1
      ? "방금 전"
      : formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ko });

  return isEdited ? `${timeStr} (수정됨)` : timeStr;
}

/**
 * 이미지 경로를 Image URL로 변환
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_PREFIX_URL;
  if (!imageUrl) return null;
  const imagePath = path.startsWith("/") ? path : `/${path}`;
  return `${imageUrl}${imagePath}`;
}
