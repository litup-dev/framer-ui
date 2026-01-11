import { useRouter } from "next/navigation";
import { z } from "zod";
import { useCommonModalStore } from "@/store/common-modal-store";
import { useUserStore } from "@/store/user-store";
import {
  useToggleCommentLike,
  useDeleteComment,
  useCreateComment,
  useUpdateComment,
} from "../query-options";
import type { PerformanceCommentItem } from "../types";

const COMMENT_MAX_LENGTH = 100;

const validateComment = (content: string): string | null => {
  if (!content.trim()) return "공백만 입력할 수 없습니다";
  if (content.length > COMMENT_MAX_LENGTH)
    return `댓글은 ${COMMENT_MAX_LENGTH}자 이하로 입력해주세요`;
  return null;
};

export const useCommentHandlers = (
  performanceId: number,
  commentText: string,
  setCommentText: (text: string) => void,
  setCurrentPage: (page: number) => void,
  editingCommentId: number | null,
  setEditingCommentId: (id: number | null) => void,
  editingText: string,
  setEditingText: (text: string) => void
) => {
  const router = useRouter();
  const { openModal } = useCommonModalStore();
  const { user, isAuthenticated } = useUserStore();

  const toggleLikeMutation = useToggleCommentLike(performanceId);
  const deleteCommentMutation = useDeleteComment(performanceId);
  const createCommentMutation = useCreateComment(performanceId);
  const updateCommentMutation = useUpdateComment(performanceId);

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

  const handleCommentSubmit = (): void => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }

    const error = validateComment(commentText);
    if (error) {
      showErrorModal(error);
      return;
    }

    createCommentMutation.mutate(commentText, {
      onSuccess: () => {
        setCommentText("");
        setCurrentPage(1);
      },
      onError: (error: any) => {
        const message =
          error?.statusCode === 409
            ? error.message
            : "댓글 등록 중 오류가 발생했습니다.";
        showErrorModal(message);
      },
    });
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    const value = e.target.value;
    if (value.length <= COMMENT_MAX_LENGTH) {
      setCommentText(value);
    }
  };

  const handleEditClick = (comment: PerformanceCommentItem): void => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const handleEditCancel = (): void => {
    setEditingCommentId(null);
    setEditingText("");
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
        },
      }
    );
  };

  const handleEditTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const value = e.target.value;
    if (value.length <= COMMENT_MAX_LENGTH) {
      setEditingText(value);
    }
  };

  const handleLikeClick = (reviewId: number): void => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    toggleLikeMutation.mutate(reviewId);
  };

  const handleDeleteClick = (reviewId: number): void => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    openModal({
      description: "해당 코멘트를 삭제하시겠습니까?",
      confirmButton: {
        label: "삭제",
        onClick: () => deleteCommentMutation.mutate(reviewId),
      },
      cancelButton: {
        label: "취소",
        onClick: () => {},
      },
    });
  };

  const isMyComment = (userPublicId: string): boolean => {
    return user?.publicId === userPublicId;
  };

  return {
    maxLength: COMMENT_MAX_LENGTH,
    isAuthenticated,
    handleCommentSubmit,
    handleTextChange,
    handleEditClick,
    handleEditCancel,
    handleEditSubmit,
    handleEditTextChange,
    handleLikeClick,
    handleDeleteClick,
    isMyComment,
    createCommentMutation,
    updateCommentMutation,
  };
};
