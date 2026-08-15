import { apiClient } from "@/lib/api-client";
import type {
  PostListResponse,
  PostsQuery,
  PostDetail,
  CommentListResponse,
  MentionableUser,
  DraftListItem,
} from "./types";

export const getPosts = async (query: PostsQuery = {}): Promise<PostListResponse> => {
  const params = new URLSearchParams();
  if (query.board) params.set("board", query.board);
  if (query.category) params.set("category", query.category);
  if (query.keyword?.trim()) params.set("keyword", query.keyword.trim());
  if (query.keyword?.trim() && query.searchType) params.set("searchType", query.searchType);
  if (query.sort) params.set("sort", query.sort);
  if (query.offset !== undefined) params.set("offset", String(query.offset));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const qs = params.toString();
  return apiClient.get(`/api/v1/posts${qs ? `?${qs}` : ""}`);
};

export const getPostDetail = async (id: number): Promise<{ data: PostDetail }> => {
  return apiClient.get(`/api/v1/posts/${id}`);
};

export const getComments = async (
  postId: number,
  offset = 0,
  limit = 20,
): Promise<CommentListResponse> => {
  return apiClient.get(
    `/api/v1/posts/${postId}/comments?offset=${offset}&limit=${limit}`,
  );
};

export const createPost = async (body: {
  boardCode?: string;
  categoryCode?: string;
  title: string;
  content: string;
  imageIds?: number[];
}): Promise<{ data: { id: number } }> => {
  return apiClient.post("/api/v1/posts", body);
};

export const updatePost = async (
  id: number,
  body: {
    categoryCode?: string;
    title?: string;
    content?: string;
    imageIds?: number[];
  },
): Promise<{ data: { id: number } }> => {
  return apiClient.patch(`/api/v1/posts/${id}`, body);
};

export const deletePost = async (id: number) => {
  return apiClient.delete(`/api/v1/posts/${id}`);
};

// ── Draft (임시저장) ────────────────────────────────
// 유저당 draft 1개만 허용. 이미 있으면 그 슬롯을 이번 내용으로 덮어씀.
export const createDraft = async (body: {
  boardCode?: string;
  categoryCode?: string;
  title?: string;
  content?: string;
  imageIds?: number[];
}): Promise<{ data: { id: number; isNew: boolean } }> => {
  return apiClient.post("/api/v1/posts/draft", body);
};

// 자동저장. imageIds는 매번 최종 상태 전체 전송 (부분 diff X).
export const updateDraft = async (
  id: number,
  body: {
    categoryCode?: string;
    title?: string;
    content?: string;
    imageIds?: number[];
  },
): Promise<{ data: { success: boolean; operation: string } }> => {
  return apiClient.patch(`/api/v1/posts/draft/${id}`, body);
};

// title/content 둘 다 비면 400
export const publishDraft = async (
  id: number,
): Promise<{ data: { id: number } }> => {
  return apiClient.post(`/api/v1/posts/draft/${id}/publish`);
};

export const getDrafts = async (
  offset = 0,
  limit = 20,
): Promise<{ data: { items: DraftListItem[]; total: number; offset: number; limit: number } }> => {
  return apiClient.get(`/api/v1/posts/drafts?offset=${offset}&limit=${limit}`);
};

export const toggleLike = async (
  postId: number,
  likeType: "LIKE" | "DISLIKE",
): Promise<{ data: { myLikeType: string | null; likeCount: number; dislikeCount: number } }> => {
  return apiClient.post(`/api/v1/posts/${postId}/like`, { likeType });
};

export const createComment = async (
  postId: number,
  body: { content: string; parentId?: number; mentionedUserIds?: number[] },
): Promise<{ data: { id: number } }> => {
  return apiClient.post(`/api/v1/posts/${postId}/comments`, body);
};

export const getMentionableUsers = async (
  postId: number,
): Promise<{ data: MentionableUser[] }> => {
  return apiClient.get(`/api/v1/posts/${postId}/mentionable-users`);
};

export const deleteComment = async (commentId: number) => {
  return apiClient.delete(`/api/v1/comments/${commentId}`);
};

export const updateComment = async (
  commentId: number,
  content: string,
  mentionedUserIds: number[] = [],
) => {
  return apiClient.patch(`/api/v1/comments/${commentId}`, { content, mentionedUserIds });
};

export const toggleCommentLike = async (
  commentId: number,
): Promise<{ data: { isLiked: boolean; likeCount: number } }> => {
  return apiClient.post(`/api/v1/comments/${commentId}/like`);
};

export const uploadPostImage = async (
  file: File,
): Promise<{ data: { id: number; filePath: string } }> => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/api/v1/upload/post-image", formData);
};
