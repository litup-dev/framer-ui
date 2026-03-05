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
