import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import jwt from "jsonwebtoken";

const createToken = (userId: string, secret: string) => {
  return jwt.sign(
    {
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 5,
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
          scope: "profile_nickname profile_image",
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
            console.log("커스텀 토큰 만료 예정 - 갱신 중...");
            const newToken = createToken(
              token.userId as string,
              process.env.NEXTAUTH_SECRET!
            );
            token.accessToken = newToken;
            console.log("토큰 갱신 완료:", newToken);
          }
        } catch (error) {
          console.error("토큰 갱신 중 에러:", error);
        }
      }

      if (account) {
        const payload = {
          userId: account.providerAccountId,
          username: token?.name,
        };

        try {
          const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/auth/register`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          if (response && response.ok) {
            const result = await response.json();

            const userId = result.data.userId;
            const newToken = createToken(userId, process.env.NEXTAUTH_SECRET!);

            token.accessToken = newToken;
            token.userId = userId;
          } else {
            console.error("유저 생성 실패:", response.status);
          }
        } catch (error) {
          console.error("API 호출 에러:", error);
        }
      } else {
        console.log("기존 로그인된 사용자 - API 호출 안함");
      }

      return { ...token };
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
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
