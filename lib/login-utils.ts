const RETURN_URL_KEY = "login-return-url";

export const saveReturnUrl = (pathname: string, search?: string) => {
  if (typeof window === "undefined") return;

  const currentUrl = pathname + (search || window.location.search);
  if (currentUrl !== "/login" && currentUrl !== "/login/success") {
    sessionStorage.setItem(RETURN_URL_KEY, currentUrl);
  }
};

export const getReturnUrl = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(RETURN_URL_KEY);
};

export const clearReturnUrl = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RETURN_URL_KEY);
};

export { RETURN_URL_KEY };
