import type {
  Id,
  ISODateTime,
  ISOTime,
  GeoPoint4326,
} from "@/lib/types/common";

export interface Club {
  id: Id;
  created_at?: ISODateTime | null;
  name?: string | null;
  location?: GeoPoint4326 | null;
  phone?: string | null;
  open_time?: ISOTime | null;
  close_time?: ISOTime | null;
  capacity?: number | null;
  address?: string | null;
  description?: string | null;
}

// ---------------------- club_img_tb ----------------------
export interface ClubImg {
  id: Id;
  club_id: Id;
  file_path?: string | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  is_main?: boolean | null;
}

export interface ClubReview {
  id: Id;
  club_id: Id;
  user_id: Id;
  rating?: number | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  content?: string | null;
}

export interface ClubReviewImg {
  id: Id;
  review_id: Id;
  file_path?: string | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  is_main?: boolean | null;
}

export interface ClubReviewKeyword {
  id: Id;
  keyword_id: Id;
  review_id: Id;
}

export interface ClubReviewReport {
  id: Id;
  club_id: Id;
  user_id: Id;
  rating?: number | null;
  created_at?: ISODateTime | null;
  updated_at?: ISODateTime | null;
  content?: string | null;
  reporter_id?: Id | null;
  reason?: string | null;
}

export interface Favorite {
  id: Id;
  club_id: Id;
  user_id: Id;
}
