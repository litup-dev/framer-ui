export type BoardCode = "FREE";
export type CategoryCode = "GENERAL" | "BAND_PROMO" | "PERFORM_REVIEW";
export type SortType = "-createdAt" | "+createdAt";
export type PostSearchType = "TITLE_CONTENT" | "TITLE" | "CONTENT" | "AUTHOR";
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
  content?: string; // 목록용 본문 미리보기 (plain text, 2줄 clamp로 표시)
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
  searchType?: PostSearchType;
  sort?: SortType;
  offset?: number;
  limit?: number;
}

export interface PostImage {
  id: number;
  filePath: string;
}

// 게시글에 태그된 클럽/공연 (상세 조회 전용, 목록에는 노출 안 됨)
export interface ClubTag {
  id: number;
  name: string;
  address: string;
  mainImage: PostImage | null;
}

export interface PerformTagArtist {
  name: string;
}

export interface PerformTag {
  id: number;
  title: string;
  artists: PerformTagArtist[];
  performDate: string;
  mainImage: PostImage | null;
}

// 글쓰기 태그 검색/선택 UI에서 쓰는 최소 정보 (클럽/공연 검색 결과 및 선택된 칩 표시용)
export interface TaggableClub {
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
}

export interface TaggablePerform {
  id: number;
  title: string;
  artistLabel: string;
  performDate: string;
  imageUrl: string | null;
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
  clubTags: ClubTag[];
  performTags: PerformTag[];
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
