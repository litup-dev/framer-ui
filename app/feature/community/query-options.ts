import { queryOptions } from "@tanstack/react-query";
import {
  getPosts,
  getPostDetail,
  getComments,
  getMentionableUsers,
  getDrafts,
} from "./api";
import type { PostsQuery, SortType } from "./types";

export const postsQueryOptions = (query: PostsQuery) =>
  queryOptions({
    queryKey: ["posts", query],
    queryFn: () => getPosts(query),
  });

export const postDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["posts", id],
    queryFn: () => getPostDetail(id),
  });

export const commentsQueryOptions = (
  postId: number,
  offset = 0,
  limit = 20,
  sort: SortType = "+createdAt",
) =>
  queryOptions({
    queryKey: ["posts", postId, "comments", { offset, limit, sort }],
    queryFn: () => getComments(postId, offset, limit, sort),
  });

export const mentionableUsersQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: ["posts", postId, "mentionable-users"],
    queryFn: () => getMentionableUsers(postId),
    staleTime: 5 * 60 * 1000,
  });

export const draftsQueryOptions = (offset = 0, limit = 10) =>
  queryOptions({
    queryKey: ["posts", "drafts", { offset, limit }],
    queryFn: () => getDrafts(offset, limit),
    staleTime: 0,
  });
