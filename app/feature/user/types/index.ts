import type { Id, ISODateTime } from "@/lib/types/common";

export interface User {
  ID: Id;
  id: Id;
  nickname?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  profile_path?: string | null;
}

export interface UserSession {
  id: Id;
}

export interface SocialCode {
  id: Id;
  code?: string | null;
  name?: string | null;
}

export interface RoleCode {
  id: Id;
  code?: string | null;
  name?: string | null;
}
