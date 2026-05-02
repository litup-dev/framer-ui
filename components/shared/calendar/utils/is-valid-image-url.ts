export const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  if (url.startsWith("/")) return true;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
};
