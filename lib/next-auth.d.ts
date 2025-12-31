import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    publicId?: string;
    accessToken?: string;
    refreshToken?: string;
    expires?: string;
    nickname?: string;
    profilePath?: string | null;
    bio?: string;
    provider?: string;
  }

  interface JWT {
    publicId?: string;
    nickname?: string;
    profilePath?: string | null;
    bio?: string;
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
