import { queryOptions } from "@tanstack/react-query";

const getPostsOptions = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: async () => {
      const baseUrl = process.env.API_URL;
      const url = baseUrl ? `${baseUrl}/feature/home/api` : "/feature/home/api";
      const res = await fetch(url);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export { getPostsOptions };
