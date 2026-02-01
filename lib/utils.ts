import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 이미지 경로를 Image URL로 변환
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  if (!imageUrl) return null;
  const imagePath = path.startsWith("/") ? path : `/${path}`;
  return `${imageUrl}${imagePath}`;
}
