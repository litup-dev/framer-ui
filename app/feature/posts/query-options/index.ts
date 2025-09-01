import { queryOptions } from "@tanstack/react-query";

const getPostsByIdOptions = (id: string) =>
  queryOptions({
    queryKey: ["posts", id],
    enabled: !!id,
    queryFn: async () => {
      const baseUrl = process.env.API_URL;
      const url = baseUrl ? `${baseUrl}/feature/home/api` : "/feature/home/api";
      const res = await fetch(url);
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

export { getPostsByIdOptions };
