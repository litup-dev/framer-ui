import { QueryClient, isServer } from "@tanstack/react-query";
import { handleGlobalError } from "@/lib/error-handler";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          // 글로벌 에러 핸들러 호출 (인증 에러 시 자동 로그아웃)
          handleGlobalError(error);
          return false;
        },
      },
      mutations: {
        retry: false,
        onError: (error) => {
          // 모든 mutation 에러를 글로벌 핸들러로 전달
          handleGlobalError(error);
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
