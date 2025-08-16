import { queryOptions } from "@tanstack/react-query";

const getPostsOptions = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/feature/home/api`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

const getPostsByIdOptions = (id: string) =>
  queryOptions({
    queryKey: ["posts", id],
    enabled: !!id,
    queryFn: async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/feature/home/api`);
      const posts = await res.json();
      const post = posts.find((p: any) => p.id === Number(id));
      if (!post) {
        throw new Error(`Post with id ${id} not found`);
      }
      return post;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export { getPostsOptions, getPostsByIdOptions };
