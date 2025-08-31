import type { Id, ISODateTime } from "@/lib/types/common";

export interface Perform {
  id: Id;
  club_id: Id;
  user_id: Id;
  title?: string | null;
  description?: string | null;
  start_time?: ISODateTime | null;
  end_time?: ISODateTime | null;
  price?: number | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  is_cancelled?: boolean | null;
  artists?: unknown | null;
  sns_links?: unknown | null;
  Field?: string | null;
}

export interface PerformImg {
  id: Id;
  perform_id: Id;
  file_path?: string | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  is_main?: boolean | null;
}

export interface Attend {
  id: Id;
  perform_id: Id;
  user_id: Id;
}
