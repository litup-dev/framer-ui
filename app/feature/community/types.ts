export type BoardCode = "FREE";
export type CategoryCode = "GENERAL" | "BAND_PROMO" | "PERFORM_REVIEW";
export type SortType = "-createdAt" | "+createdAt";
export type LikeType = "LIKE" | "DISLIKE";

export interface PostAuthor {
  id: number;
  nickname: string;
  profilePath: string | null;
}

export interface MentionableUser {
  id: number;
  nickname: string;
  profilePath: string | null;
  isAuthor: boolean;
}

// 임시저장 목록용 - author/카운트 필드 없음
export interface DraftListItem {
  id: number;
  boardCode: BoardCode;
  category: PostCategory | null;
  title: string;
  createdAt: string;
  updatedAt: string | null;
  thumbnails: PostThumbnail[];
  imageCount: number;
}

export interface PostCategory {
  code: CategoryCode;
  name: string;
}

export interface PostThumbnail {
  id: number;
  filePath: string; // 상대경로, getImageUrl로 절대 URL 조합
}

export interface PostItem {
  id: number;
  boardCode: BoardCode;
  category: PostCategory | null;
  title: string;
  thumbnails: PostThumbnail[]; // 등록순 최대 4장 (없으면 빈 배열)
  imageCount: number;          // 첨부된 전체 이미지 개수
  createdAt: string;
  updatedAt: string | null;
  author: PostAuthor;
  likeCount: number;
  dislikeCount: number;
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

export interface PostsQuery {
  board?: BoardCode;
  category?: CategoryCode;
  keyword?: string;
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
  isDraft?: boolean;
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
  likeCount: number;
  isLiked: boolean;
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
