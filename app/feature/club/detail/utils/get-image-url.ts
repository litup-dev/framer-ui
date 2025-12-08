export const getImageUrl = (
  filePath: string | null | undefined
): string | null => {
  if (!filePath) return null;
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const path = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${apiBaseUrl}${path}`;
};
