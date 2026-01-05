import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    publicId?: string;
    userId?: number;
    accessToken?: string;
    nickname?: string;
    profilePath?: string | null;
  }

  interface JWT {
    publicId?: string;
    userId?: number;
    nickname?: string;
    profilePath?: string | null;
    accessToken?: string;
    refreshToken?: string;
  }
}
