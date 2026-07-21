import { queryOptions } from "@tanstack/react-query";
import { getPosts, getPostDetail, getComments } from "./api";
import type { PostsQuery } from "./types";

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

export const commentsQueryOptions = (postId: number, offset = 0, limit = 20) =>
  queryOptions({
    queryKey: ["posts", postId, "comments", { offset, limit }],
    queryFn: () => getComments(postId, offset, limit),
  });
