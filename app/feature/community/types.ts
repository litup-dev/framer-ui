export type BoardCode = "FREE" | "PERFORM_REVIEW";
export type CategoryCode = "GENERAL" | "BAND_PROMO" | "PERFORM_REVIEW";
export type SortType = "-createdAt" | "+createdAt";
export type LikeType = "LIKE" | "DISLIKE";

export interface PostAuthor {
  id: number;
  nickname: string;
  profilePath: string | null;
}

export interface PostCategory {
  code: CategoryCode;
  name: string;
}

export interface PostItem {
  id: number;
  boardCode: BoardCode;
  category: PostCategory | null;
  title: string;
  contentPreview?: string;   // 백엔드 추가 필요: 약 100자 미리보기
  thumbnail?: string | null; // 백엔드 추가 필요: 첫 번째 이미지 경로
  imageCount?: number;       // 백엔드 추가 필요: 이미지 총 개수
  createdAt: string;
  updatedAt: string | null;
  author: PostAuthor;
  likeCount: number;
  dislikeCount?: number; // 백엔드 추가 필요: 목록 API에 dislikeCount 추가
  commentCount: number;
}

export interface PostListResponse {
  data: {
    items: PostItem[];
    total: number;
    offset: number;
    limit: number;
  };
}

export type SearchType = "all" | "title" | "content" | "author";

export interface PostsQuery {
  board?: BoardCode;
  category?: CategoryCode;
  keyword?: string;
  searchType?: SearchType; // 백엔드 추가 필요 (기본: all)
  sort?: SortType;
  offset?: number;
  limit?: number;
}

export interface PostImage {
  id: number;
  filePath: string;
}

export interface PostDetail {
  id: number;
  boardCode: BoardCode;
  category: PostCategory | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  author: PostAuthor;
  images: PostImage[];
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  isMine: boolean;
  myLikeType: LikeType | null;
}

export interface Comment {
  id: number;
  parentId: number | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  author: PostAuthor | null;
  isMine: boolean;
  isDeleted: boolean;
  replies: Comment[];
}

export interface CommentListResponse {
  data: {
    items: Comment[];
    total: number;
    offset: number;
    limit: number;
  };
}
