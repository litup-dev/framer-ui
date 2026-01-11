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
            console.log(result, "<<<<< result");
            const publicId = result.data?.publicId;
            const userId = result.data?.id;

            if (userId) {
              const accessToken = createAccessToken(
                String(userId),
                process.env.NEXTAUTH_SECRET!
              );
              const refreshToken = createRefreshToken(
                String(userId),
                process.env.NEXTAUTH_SECRET!
              );

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
                    publicId: String(userId),
                    userId: userId,
                    nickname: userInfo.data?.nickname || "",
                    profilePath: userInfo.data?.profilePath || null,
                    accessToken,
                    refreshToken,
                  };
                }

                return {
                  publicId: String(userId),
                  userId: userId,
                  nickname: result.data?.nickname || "",
                  profilePath: result.data?.profilePath || null,
                  accessToken,
                  refreshToken,
                };
              } catch (error) {}
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
        accessToken: token.accessToken as string | undefined,
        nickname: (token.nickname as string) || "",
        profilePath: (token.profilePath as string) || null,
        publicId: (token.publicId as string) || "",
        userId: token.userId as number | undefined,
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
