export interface PerformanceDetailResponse {
  data: {
    id: number;
    title: string;
    description: string;
    performDate: string;
    bookingPrice: number;
    onsitePrice: number;
    bookingUrl: string;
    isCanceled: boolean;
    artists: Array<{
      name: string;
    }>;
    snsLinks: Array<{
      instagram: string;
      youtube: string;
    }>;
    createdAt: string;
    club: {
      id: number;
      name: string;
      address: string;
    };
    images: Array<{
      id: number;
      filePath: string;
      isMain: boolean;
    }>;
    isAttend: boolean;
  };
  message: string;
}

// 호환성을 위한 alias
export type PerformanceInfoResponse = PerformanceDetailResponse;

export interface PerformanceCommentResponse {
    data: {
        items: PerformanceCommentItem[];
        total: number;
        offset: number;
        limit: number;
    };
}

export interface PerformanceCommentItem {
  id: number;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    publicId: string;
    nickname: string;
    profilePath?: string;
  };
  isLiked: boolean;
}