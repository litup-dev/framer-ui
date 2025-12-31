import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: string;
    accessToken?: string;
    nickname?: string;
    profilePath?: string | null;
  }

  interface JWT {
    userId?: string;
    nickname?: string;
    profilePath?: string | null;
    accessToken?: string;
    refreshToken?: string;
  }
}
