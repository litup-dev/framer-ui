import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    publicId?: string;
    accessToken?: string;
    nickname?: string;
    profilePath?: string | null;
  }

  interface JWT {
    publicId?: string;
    nickname?: string;
    profilePath?: string | null;
    accessToken?: string;
    refreshToken?: string;
  }
}
