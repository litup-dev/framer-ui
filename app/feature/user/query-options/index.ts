import { queryOptions } from "@tanstack/react-query";

const getUserOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/feature/user/api`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export { getUserOptions };
