import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  PerformanceDetailResponse,
  PerformanceCommentResponse,
} from "@/app/feature/performance/detail/types";

// 공연 상세 정보 API
export const getPerformanceDetailOptions = (performanceId: number) =>
  queryOptions({
    queryKey: ["performanceDetail", performanceId],
    queryFn: async () => {
      const response = await apiClient.get<PerformanceDetailResponse>(
        `/api/v1/performances/${performanceId}/details`
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!performanceId,
  });

// 공연 댓글 목록 API (일반 Query - Pagination)
export const getPerformanceCommentsOptions = (
  performanceId: number,
  offset: number = 0,
  limit: number = 10
) =>
  queryOptions({
    queryKey: ["performanceComments", performanceId, offset, limit],
    queryFn: async () => {
      const response = await apiClient.get<PerformanceCommentResponse>(
        `/api/v1/performance/${performanceId}/reviews?offset=${offset}&limit=${limit}`
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!performanceId,
  });

// 댓글 좋아요 토글 Mutation
export const useToggleCommentLike = (performanceId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {
      const response = await apiClient.post<{
        data: {
          reviewId: number;
          totalLikeCount: number;
        };
        message: string;
      }>(`/api/v1/performances/review/${reviewId}/like`, {});
      return { ...response, reviewId };
    },
    onMutate: async (reviewId) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({
        queryKey: ["performanceComments", performanceId],
      });

      // 이전 값 저장
      const previousComments = queryClient.getQueriesData({
        queryKey: ["performanceComments", performanceId],
      });

      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: ["performanceComments", performanceId] },
        (old: any) => {
          if (!old?.data?.items) return old;

          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((comment: any) =>
                comment.id === reviewId
                  ? {
                      ...comment,
                      isLiked: !comment.isLiked,
                      likeCount: comment.isLiked
                        ? comment.likeCount - 1
                        : comment.likeCount + 1,
                    }
                  : comment
              ),
            },
          };
        }
      );

      return { previousComments };
    },
    onSuccess: (response) => {
      // 서버 응답으로 실제 likeCount 업데이트
      queryClient.setQueriesData(
        { queryKey: ["performanceComments", performanceId] },
        (old: any) => {
          if (!old?.data?.items) return old;

          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((comment: any) =>
                comment.id === response.reviewId
                  ? {
                      ...comment,
                      likeCount: response.data.totalLikeCount,
                    }
                  : comment
              ),
            },
          };
        }
      );
    },
    onError: (_err, _reviewId, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
};

// 댓글 삭제 Mutation
export const useDeleteComment = (performanceId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {
      const response = await apiClient.delete(
        `/api/v1/performance/reviews/${reviewId}`,
        {}
      );
      return response;
    },
    onSuccess: () => {
      // 댓글 목록 쿼리 무효화하여 자동 refetch
      queryClient.invalidateQueries({
        queryKey: ["performanceComments", performanceId],
      });
    },
  });
};

// 댓글 등록 Mutation
export const useCreateComment = (performanceId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await apiClient.post(
        `/api/v1/performance/${performanceId}/reviews`,
        {
          content: content,
        }
      );
      return response;
    },
    onSuccess: () => {
      // 댓글 목록 쿼리 무효화하여 자동 refetch
      queryClient.invalidateQueries({
        queryKey: ["performanceComments", performanceId],
      });
    },
  });
};

// 댓글 수정 Mutation
export const useUpdateComment = (performanceId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      content,
    }: {
      reviewId: number;
      content: string;
    }) => {
      const response = await apiClient.patch(
        `/api/v1/performance/reviews/${reviewId}`,
        {
          content: content,
        }
      );
      return response;
    },
    onSuccess: () => {
      // 댓글 목록 쿼리 무효화하여 자동 refetch
      queryClient.invalidateQueries({
        queryKey: ["performanceComments", performanceId],
      });
    },
  });
};

// 공연 참석 토글 Mutation
export const useToggleAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (performanceId: number) => {
      const response = await apiClient.post(
        `/api/v1/performances/${performanceId}/attend`,
        {}
      );
      return response;
    },
    onSuccess: (_data, performanceId) => {
      // 공연 상세 정보 쿼리 무효화하여 자동 refetch
      queryClient.invalidateQueries({
        queryKey: ["performanceDetail", performanceId],
      });
    },
  });
};

// 신고하기 Mutation
export const useReportContent = () => {
  return useMutation({
    mutationFn: async ({
      typeId,
      categoryId,
      entityId,
      content,
    }: {
      typeId: number;
      categoryId: number;
      entityId: number;
      content: string;
    }) => {
      const response = await apiClient.post<{
        data: {
          success: boolean;
          operation: string;
          message: string;
        };
        message: string;
      }>("/api/v1/report", {
        typeId,
        categoryId,
        entityId,
        content,
      });
      return response;
    },
  });
};
