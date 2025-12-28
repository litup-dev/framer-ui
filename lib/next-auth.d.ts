import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: number;
    accessToken?: string;
    refreshToken?: string;
    expires?: string;
    nickname?: string;
    profilePath?: string | null;
    bio?: string;
    provider?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    userId?: number;
    nickname?: string;
    profilePath?: string | null;
    bio?: string;
    provider?: string;
  }
}
