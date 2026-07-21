import { apiClient } from "@/lib/api-client";
import type {
  PostListResponse,
  PostsQuery,
  PostDetail,
  CommentListResponse,
} from "./types";

export const getPosts = async (query: PostsQuery = {}): Promise<PostListResponse> => {
  const params = new URLSearchParams();
  if (query.board) params.set("board", query.board);
  if (query.category) params.set("category", query.category);
  if (query.keyword?.trim()) params.set("keyword", query.keyword.trim());
  if (query.searchType && query.searchType !== "all") params.set("searchType", query.searchType);
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

export const deletePost = async (id: number) => {
  return apiClient.delete(`/api/v1/posts/${id}`);
};

export const toggleLike = async (
  postId: number,
  likeType: "LIKE" | "DISLIKE",
): Promise<{ data: { myLikeType: string | null; likeCount: number; dislikeCount: number } }> => {
  return apiClient.post(`/api/v1/posts/${postId}/like`, { likeType });
};

export const createComment = async (
  postId: number,
  body: { content: string; parentId?: number },
): Promise<{ data: { id: number } }> => {
  return apiClient.post(`/api/v1/posts/${postId}/comments`, body);
};

export const deleteComment = async (commentId: number) => {
  return apiClient.delete(`/api/v1/comments/${commentId}`);
};

export const updateComment = async (commentId: number, content: string) => {
  return apiClient.patch(`/api/v1/comments/${commentId}`, { content });
};

export const uploadPostImage = async (
  file: File,
): Promise<{ data: { id: number; filePath: string } }> => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/api/v1/upload/post-image", formData);
};
