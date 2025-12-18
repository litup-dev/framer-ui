export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const sessionResponse = await fetch("/api/auth/session");
  const session = await sessionResponse.json();

  const headers = new Headers(options?.headers);

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}



















