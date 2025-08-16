import { QueryClient } from "@tanstack/react-query";

let serverQueryClient: QueryClient | undefined;

export const getServerQueryClient = () => {
  if (!serverQueryClient) {
    serverQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
        },
      },
    });
  }
  return serverQueryClient;
};
