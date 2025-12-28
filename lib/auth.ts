import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import jwt from "jsonwebtoken";

const createAccessToken = (userId: string, secret: string) => {
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
};

const createRefreshToken = (userId: string, secret: string) => {
  return jwt.sign({ userId }, secret, { expiresIn: "30d" });
};

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "account_email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // update() 호출 시 session 데이터로 token 업데이트
      if (trigger === "update" && session) {
        return {
          ...token,
          ...session,
        };
      }

      if (!account && token.accessToken) {
        try {
          const decoded = jwt.decode(token.accessToken as string) as any;
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded && decoded.exp && decoded.exp <= currentTime) {
            const userId = decoded.userId;

            if (token.refreshToken) {
              const refreshDecoded = jwt.decode(
                token.refreshToken as string
              ) as any;

              if (
                refreshDecoded &&
                refreshDecoded.exp &&
                refreshDecoded.exp > currentTime
              ) {
                const newAccessToken = createAccessToken(
                  userId,
                  process.env.NEXTAUTH_SECRET!
                );
                token.accessToken = newAccessToken;
              } else {
                return { ...token, error: "RefreshTokenExpired" };
              }
            } else {
              const newAccessToken = createAccessToken(
                userId,
                process.env.NEXTAUTH_SECRET!
              );
              token.accessToken = newAccessToken;
            }
          }
        } catch (error) {}
        return { ...token };
      }

      if (account) {
        const payload: {
          providerId: string;
          provider: string;
          email?: string;
        } = {
          providerId: account.providerAccountId,
          provider: "kakao",
        };

        if (user?.email) {
          payload.email = user.email;
        }

        try {
          const apiUrl = `${process.env.API_BASE_URL}/api/v1/auth/verify`;

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response && response.ok) {
            const result = await response.json();

            const userId = result.data?.id || result.data?.userId;
            if (userId) {
              const accessToken = createAccessToken(
                String(userId),
                process.env.NEXTAUTH_SECRET!
              );
              const refreshToken = createRefreshToken(
                String(userId),
                process.env.NEXTAUTH_SECRET!
              );

              // 최신 유저 정보 조회
              try {
                const userInfoResponse = await fetch(
                  `${process.env.API_BASE_URL}/api/v1/users/${userId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                if (userInfoResponse.ok) {
                  const userInfo = await userInfoResponse.json();
                  return {
                    userId: userId,
                    nickname: userInfo.data?.nickname || "",
                    profilePath: userInfo.data?.profilePath || null,
                    bio: userInfo.data?.bio || "",
                    provider: account.provider || "",
                    accessToken,
                    refreshToken,
                  };
                }
              } catch (error) {
                // 유저 정보 조회 실패 시 기본값 사용
              }

              // 유저 정보 조회 실패 시 verify 응답 사용
              return {
                userId: userId,
                nickname: result.data?.nickname || "",
                profilePath: result.data?.profilePath || null,
                bio: result.data?.bio || "",
                provider: account.provider || "",
                accessToken,
                refreshToken,
              };
            }
          } else {
            const errorText = await response.text();
          }
        } catch (error) {}
      }

      return { ...token };
    },
    async session({ session, token }) {
      return {
        accessToken: token.accessToken,
        nickname: (token.nickname as string) || "",
        profilePath: (token.profilePath as string) || null,
        bio: (token.bio as string) || "",
        provider: (token.provider as string) || "",
        userId: (token.userId as number) || 0,
      } as typeof session;
    },
    async signIn() {
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
