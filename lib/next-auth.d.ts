import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: number;
    accessToken?: string;
    refreshToken?: string;
    expires?: string;
    nickname?: string;
    profilePath?: string | null;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}
