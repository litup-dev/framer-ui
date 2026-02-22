import { cookies } from "next/headers";

interface SetCookieParams {
  token: string;
  publicId: string;
  nickname: string;
  profilePath: string;
}

export async function setCookie({ token, publicId }: SetCookieParams) {
  const cookieStore = await cookies();
  const jsonObj = JSON.stringify({
    publicId,
  });

  cookieStore.set("user", jsonObj, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}
