import { apiClient } from "@/lib/api-client";
import type {
  PostListResponse,
  PostsQuery,
  PostDetail,
  CommentListResponse,
  MentionableUser,
} from "./types";

export const getPosts = async (query: PostsQuery = {}): Promise<PostListResponse> => {
  const params = new URLSearchParams();
  if (query.board) params.set("board", query.board);
  if (query.category) params.set("category", query.category);
  if (query.keyword?.trim()) params.set("keyword", query.keyword.trim());
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
export const createDraft = async (body: {
  boardCode?: string;
  categoryCode?: string;
  title?: string;
  content?: string;
  imageIds?: number[];
}): Promise<{ data: { id: number } }> => {
  return apiClient.post("/api/v1/posts/draft", body);
};

export const updateDraft = async (
  id: number,
  body: {
    categoryCode?: string;
    title?: string;
    content?: string;
    imageIds?: number[];
  },
): Promise<{ data: { id: number } }> => {
  return apiClient.patch(`/api/v1/posts/draft/${id}`, body);
};

export const publishDraft = async (
  id: number,
): Promise<{ data: { id: number } }> => {
  return apiClient.post(`/api/v1/posts/draft/${id}/publish`);
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

export const updateComment = async (commentId: number, content: string) => {
  return apiClient.patch(`/api/v1/comments/${commentId}`, { content });
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
