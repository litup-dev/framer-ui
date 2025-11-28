import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import jwt from "jsonwebtoken";

const createAccessToken = (userId: string, secret: string) => {
  return jwt.sign(
    {
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    secret
  );
};

const createRefreshToken = (userId: string, secret: string) => {
  const oneMonthInSeconds = 30 * 24 * 60 * 60;
  return jwt.sign(
    {
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + oneMonthInSeconds,
    },
    secret
  );
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
    async jwt({ token, user, account }) {
      if (!account && token.userId && token.accessToken) {
        try {
          const decoded = jwt.decode(token.accessToken as string) as any;
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded && decoded.exp && decoded.exp <= currentTime) {
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
                  token.userId as string,
                  process.env.NEXTAUTH_SECRET!
                );
                token.accessToken = newAccessToken;
              } else {
                return { ...token, error: "RefreshTokenExpired" };
              }
            } else {
              const newAccessToken = createAccessToken(
                token.userId as string,
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

              token.accessToken = accessToken;
              token.refreshToken = refreshToken;
              token.userId = String(userId);
            }
          } else {
            const errorText = await response.text();
          }
        } catch (error) {}
      }

      return { ...token };
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }

      if (token.userId) {
        session.userId = token.userId as string;
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }

      return session;
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
