import { QueryClient } from "@tanstack/react-query";

let serverQueryClient: QueryClient | undefined;

export const getServerQueryClient = () => {
  if (!serverQueryClient) {
    serverQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity, // 서버에서 prefetch한 데이터는 무한히 유지
          gcTime: Infinity, // 가비지 컬렉션 비활성화
          retry: false, // 재시도 비활성화
        },
      },
    });
  }
  return serverQueryClient;
};
