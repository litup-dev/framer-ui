import { queryOptions } from "@tanstack/react-query";

const getPostsOptions = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: async () => {
      const baseUrl = "http://localhost:3000";
      const res = await fetch(`${baseUrl}/feature/home/api`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export { getPostsOptions };
