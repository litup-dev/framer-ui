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
  performReviewCount: number;
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
    userId: number;
    nickname: string;
    bio: string;
    profilePath: string | null;
    provider: string;
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
