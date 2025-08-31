import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions: NextAuthOptions = {
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
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.properties?.nickname,
          email: undefined,
          image:
            profile.properties?.profile_image ||
            profile.properties?.thumbnail_image,
        };
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
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // 로그인 시 사용자 정보 로깅
      console.log("SignIn - User:", user);
      console.log("SignIn - Account:", account);
      console.log("SignIn - Profile:", profile);
      console.log("SignIn - Profile Properties:", (profile as any)?.properties);
      console.log(
        "SignIn - Profile Kakao Account:",
        (profile as any)?.kakao_account
      );
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
