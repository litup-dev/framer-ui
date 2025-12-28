import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    expires?: string;
    nickname?: string;
    profilePath?: string | null;
    bio?: string;
    provider?: string;
  }

  interface JWT {
    userId?: string;
    nickname?: string;
    profilePath?: string | null;
    bio?: string;
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
