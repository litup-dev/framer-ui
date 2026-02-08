// User Stats 응답 타입
export interface UserStatsResponse {
  data: {
    attendCount: number;
    performReviewCount: number;
  };
  message: string;
}

export interface UserStats {
  attendCount: number;
  // performReviewCount: number; // TODO: 게시글 수 API 추가 예정
  // commentCount: number; // TODO: 댓글 수 API 추가 예정
}

// Viewing History 응답 타입
export interface PerformHistoryItem {
  id: number;
  title: string;
  performDate: string;
  artists: {
    name: string;
  }[];
  createdAt: string;
  images: {
    id: number;
    filePath: string;
    isMain: boolean;
  }[];
  club: {
    name: string;
  };
}

export interface PerformHistoryResponse {
  data: {
    items: PerformHistoryItem[];
    total: number;
    offset: number;
    limit: number;
  };
  message?: string;
}

// Favorite Clubs 응답 타입
export interface FavoriteClubItem {
  id: number;
  name: string;
  mainImage: {
    id: number;
    filePath: string;
    isMain: boolean;
  };
  isFavorite?: boolean; // 캐시에서 관리하는 즐겨찾기 상태 (옵셔널)
}

export interface FavoriteClubsResponse {
  data: {
    items: FavoriteClubItem[];
    total: number;
    offset: number;
    limit: number;
  };
  message?: string;
}

// Favorite Clubs 삭제 요청 타입
export interface DeleteFavoriteClubsRequest {
  entityIds: number[];
}

export interface DeleteFavoriteClubsResponse {
  message?: string;
}

// Perform History 삭제 요청 타입
export interface DeletePerformHistoryRequest {
  entityIds: number[];
}

export interface DeletePerformHistoryResponse {
  message?: string;
}

// 유저 정보 조회 응답 타입
export interface UserInfoResponse {
  data: {
    publicId: string;
    nickname: string;
    bio: string;
    profilePath: string | null;
    socialCode: string;
    socialName: string;
  };
  message?: string;
}

// 유저 프로필 수정 요청 타입
export interface UpdateUserInfoRequest {
  nickname?: string;
  bio?: string;
  profilePath?: string;
}

export interface UpdateUserInfoResponse {
  message?: string;
}

// 유저 권한 응답 타입
export interface UserPermissionsResponse {
  data: {
    canViewStats: boolean;
    canViewPerformHistory: boolean;
    canViewFavoriteClubs: boolean;
  };
  message?: string;
}

export interface UserPermissions {
  canViewStats: boolean;
  canViewPerformHistory: boolean;
  canViewFavoriteClubs: boolean;
}

// 공개 범위 타입
export type PrivacyLevel = "public" | "friends" | "private";

// 유저 공개범위 설정 응답 타입
export interface PrivacySettingsResponse {
  data: {
    favoriteClubs: PrivacyLevel;
    attendance: PrivacyLevel;
    performHistory: PrivacyLevel;
  };
  message?: string;
}

// 유저 공개범위 설정 수정 요청 타입
export interface UpdatePrivacySettingsRequest {
  favoriteClubs: PrivacyLevel;
  attendance: PrivacyLevel;
  performHistory: PrivacyLevel;
}

export interface UpdatePrivacySettingsResponse {
  message?: string;
}

export interface UserClubReviewsResponse {
  data: {
    id: number;
    name: string;
    total: number;
    reviews: ClubReviewsItem[];
  }[];
  message?: string;
}

export interface ClubReviewsItem {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: number;
    nickname: string;
    profilePath?: string;
  };
  keywords: {
    id: number;
    name: string;
  }[];
  images?: {
    id: number;
    filePath: string;
    isMain: boolean;
  }[];
}