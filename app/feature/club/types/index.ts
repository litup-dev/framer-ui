export interface ClubOwner {
  id: number;
  nickname: string;
  profilePath: string | null;
}

export interface ClubImage {
  id: number;
  filePath: string;
  isMain?: boolean;
}

export interface ClubKeyword {
  id?: number;
  name?: string;
  iconPath?: string;
}

export interface Club {
  id: number;
  name: string;
  isFavorite: boolean;
  address: string;
  phone: string;
  capacity: number;
  openTime: string | null;
  closeTime: string | null;
  description: string;
  avgRating: number | null;
  reviewCnt: number | null;
  createdAt: string;
  owner: ClubOwner;
  mainImage?: ClubImage;
  keywords: ClubKeyword[];
  latitude?: number;
  longitude?: number;
}

export interface UpcomingPerform {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  [key: string]: any;
}

export interface ClubDetailData {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string | null;
  capacity: number;
  openTime: string | null;
  closeTime: string | null;
  avgRating: number | null;
  reviewCnt: number | null;
  favoriteCount: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  owner: ClubOwner;
  images: ClubImage[];
  keywords: ClubKeyword[];
  upcomingPerforms?: UpcomingPerform[];
}

export interface ClubDetail {
  data: ClubDetailData;
}

export interface ReviewKeyword {
  id: number;
  keyword: string;
  iconPath?: string;
  sortOrder: number;
}

export interface ReviewCategory {
  id: number;
  code: string;
  name: string;
  keywords: ReviewKeyword[];
}

export interface ReviewCategoryResponse {
  data: ReviewCategory[];
}

export interface ReviewUser {
  id: number;
  nickname: string;
  profilePath: string | null;
}

export interface ReviewKeywordItem {
  id: number;
  name: string;
}

export interface ReviewImage {
  id: number;
  filePath: string;
  isMain: boolean;
}

export interface Review {
  id: number;
  clubId: number;
  userId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  user: ReviewUser;
  keywords: ReviewKeywordItem[];
  images: ReviewImage[];
}

export interface ReviewResponse {
  data: Review;
}

export interface ReviewListResponse {
  data: Review[];
}

export interface ReviewPaginatedResponse {
  items: Review[];
  total: number;
  offset: number;
  limit: number;
}

export type ReviewsResponse = ReviewResponse | ReviewListResponse;

export interface CreateReviewResponse {
  id: number;
  clubId: number;
  userId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface Performance {
  id: number;
  title: string;
  performDate: string;
  bookingPrice: number;
  onsitePrice: number;
  isCanceled: boolean;
  description: string;
  isAttend: boolean;
}

export interface ClubDetailCalendarResponse {
  data: Record<string, Performance[]>;
}
