import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCommonModalStore } from "@/store/common-modal-store";
import { useUserStore } from "@/store/user-store";
import {
  useToggleCommentLike,
  useDeleteComment,
  useUpdateComment,
} from "@/app/feature/performance/detail/query-options";
import { PerformanceCommentItem as PerformanceComment } from "@/app/feature/performance/detail/types";

const COMMENT_MAX_LENGTH = 100;

const validateComment = (content: string): string | null => {
  if (!content.trim()) return "공백만 입력할 수 없습니다";
  if (content.length > COMMENT_MAX_LENGTH)
    return `댓글은 ${COMMENT_MAX_LENGTH}자 이하로 입력해주세요`;
  return null;
};

export const useUserCommentHandlers = (
  activeTab: "written" | "liked",
  editingCommentId: number | null,
  setEditingCommentId: (id: number | null) => void,
  editingText: string,
  setEditingText: (text: string) => void
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useUserStore();
  const { openModal } = useCommonModalStore();

  const toggleLikeMutation = useToggleCommentLike(0);
  const deleteCommentMutation = useDeleteComment(0);
  const updateCommentMutation = useUpdateComment(0);

  const showLoginModal = (): void => {
    openModal({
      description: "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
      confirmButton: {
        label: "확인",
        onClick: () => router.push("/login"),
      },
      cancelButton: {
        label: "취소",
        onClick: () => {},
      },
    });
  };

  const showErrorModal = (message: string): void => {
    openModal({
      description: message,
      confirmButton: {
        label: "확인",
        onClick: () => {},
      },
    });
  };

  const handleEditClick = (comment: PerformanceComment): void => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const handleEditCancel = (): void => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleEditTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const value = e.target.value;
    if (value.length <= COMMENT_MAX_LENGTH) {
      setEditingText(value);
    }
  };

  const handleEditSubmit = (reviewId: number): void => {
    const error = validateComment(editingText);
    if (error) {
      showErrorModal(error);
      return;
    }

    updateCommentMutation.mutate(
      { reviewId, content: editingText },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditingText("");
          queryClient.invalidateQueries({
            queryKey: ["myPerformanceComments"],
          });
        },
      }
    );
  };

  const handleDelete = (reviewId: number): void => {
    openModal({
      description: "해당 코멘트를 삭제하시겠습니까?",
      confirmButton: {
        label: "삭제",
        onClick: () => {
          deleteCommentMutation.mutate(reviewId, {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["myPerformanceComments"],
              });
            },
          });
        },
      },
      cancelButton: {
        label: "취소",
        onClick: () => {},
      },
    });
  };

  const handleLikeClick = (reviewId: number): void => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }

    toggleLikeMutation.mutate(reviewId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            activeTab === "written"
              ? ["myPerformanceComments"]
              : ["myLikedPerformanceComments"],
        });
      },
    });
  };

  return {
    maxLength: COMMENT_MAX_LENGTH,
    handleEditClick,
    handleEditCancel,
    handleEditTextChange,
    handleEditSubmit,
    handleDelete,
    handleLikeClick,
    updateCommentMutation,
  };
};
