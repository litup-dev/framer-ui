import { QueryClient } from "@tanstack/react-query";

let serverQueryClient: QueryClient | undefined;

export const getServerQueryClient = () => {
  if (!serverQueryClient) {
    serverQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          gcTime: Infinity,
          retry: false,
        },
      },
    });
  }
  return serverQueryClient;
};
