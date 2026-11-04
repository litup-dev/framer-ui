export const getImageUrl = (
  filePath: string | null | undefined,
): string | null => {
  if (!filePath) return null;
  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://") ||
    filePath.startsWith("blob:")
  ) {
    return filePath;
  }
  const imagePrefix =
    process.env.NEXT_PUBLIC_IMAGE_PREFIX_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "";
  if (!imagePrefix) return null;
  const path = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${imagePrefix}${path}`;
};

/**
 * 목록/카드용 포스터 URL. 썸네일(thumbPath)이 있으면 그걸, 없으면(기존 포스터) 원본을 쓴다.
 * 상세 화면처럼 크게 보여주는 곳은 getImageUrl(filePath)를 그대로 쓴다.
 */
export const getPosterThumbUrl = (
  image: { filePath?: string | null; thumbPath?: string | null } | null | undefined,
): string | null => getImageUrl(image?.thumbPath || image?.filePath);
