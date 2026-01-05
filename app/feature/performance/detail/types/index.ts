export interface PerformanceInfoResponse {
  data: {
    id: number;
    title: string;
    description: string;
    performDate: string;
    bookingPrice: number;
    onsitePrice: NamedCurve;
    bookingUrl: string;
    isCanceled: boolean;
    artists: [
      {
        name: string;
      }
    ];
    snsLinks: [
      {
        instagram: string;
        youtube: string;
      }
    ];
    createdAt: string;
    club: {
      id: number;
      name: string;
      address: string;
    };
    images: [
      {
        id: number;
        filePath: string;
        isMain: boolean;
      }
    ];
    isAttend: boolean;
  };
  message: string;
}

export interface PerformanceCommentResponse {
    data: {
        items: PerformanceCommentItem[];
        total: number;
        offset: number;
        limit: number;
    };
}

export interface PerformanceCommentItem {
  id: string;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nickname: string;
    profilePath?: string;
  };
}