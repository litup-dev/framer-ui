"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FadeIn from "@/components/shared/fade-in";
import { Title, Chip, Subtitle, Description } from "@/components/shared/typography";
import { ChevronDown } from "lucide-react";
import { getPerformanceCommentsOptions } from "../query-options";
import { useCommentHandlers } from "../hooks/use-comment-handlers";
import CommentForm from "./comment-form";
import CommentItem from "./comment-item";
import CommentPagination from "./comment-pagination";

import React from "react";

interface CommentSectionProps {
  performanceId: number;
  commentText: string;
  setCommentText: (text: string) => void;
  editingCommentId: number | null;
  setEditingCommentId: (id: number | null) => void;
  editingText: string;
  setEditingText: (text: string) => void;
  expandedComments: Map<number, boolean>;
  setExpandedComments: React.Dispatch<React.SetStateAction<Map<number, boolean>>>;
}

const CommentSection = ({
  performanceId,
  commentText,
  setCommentText,
  editingCommentId,
  setEditingCommentId,
  editingText,
  setEditingText,
  expandedComments,
  setExpandedComments
}: CommentSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { data, isLoading } = useQuery(
    getPerformanceCommentsOptions(performanceId, offset, limit)
  );

  const {
    maxLength,
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
  } = useCommentHandlers(
    performanceId,
    commentText,
    setCommentText,
    setCurrentPage,
    editingCommentId,
    setEditingCommentId,
    editingText,
    setEditingText
  );

  const comments = data?.data.items || [];
  const total = data?.data.total || 0;
  const totalPages = Math.ceil(total / limit);

  const toggleExpanded = (commentId: number) => {
    setExpandedComments(prev => {
      const newMap = new Map(prev);
      if (newMap.get(commentId)) {
        newMap.delete(commentId);
      } else {
        newMap.set(commentId, true);
      }
      return newMap;
    });
  };

  return (
    <FadeIn>
      <div className="space-y-4 pb-20 md:pb-0">
        <div className="hidden md:flex items-center gap-2">
          <Title className="text-[20px] xl:text-[22px] 2xl:text-[24px]">comment</Title>
          <Chip className="text-black-60 text-[16px] xl:text-[18px]">({total})</Chip>
        </div>

        <CommentForm
          commentText={commentText}
          maxLength={maxLength}
          isAuthenticated={isAuthenticated}
          isPending={createCommentMutation.isPending}
          onTextChange={handleTextChange}
          onSubmit={handleCommentSubmit}
        />

        <div className="flex items-center gap-6 md:gap-4">
          <div className="flex items-center">
            <Subtitle className="font-semibold text-[14px] xl:text-[16px]">
              최신순
            </Subtitle>
            <ChevronDown className="w-5 h-5 xl:w-6 xl:h-6" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Description>로딩중...</Description>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <Description>아직 댓글이 없습니다.</Description>
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isMyComment={isMyComment(comment.user.publicId)}
                isEditing={editingCommentId === comment.id}
                editingText={editingText}
                maxLength={maxLength}
                onEditClick={() => handleEditClick(comment)}
                onEditCancel={handleEditCancel}
                onEditSubmit={() => handleEditSubmit(comment.id)}
                onEditTextChange={handleEditTextChange}
                onDeleteClick={() => handleDeleteClick(comment.id)}
                onLikeClick={() => handleLikeClick(comment.id)}
                isUpdating={updateCommentMutation.isPending}
                isExpanded={expandedComments.get(comment.id) || false}
                onToggleExpand={() => toggleExpanded(comment.id)}
              />
            ))}
          </div>
        )}

        <CommentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </FadeIn>
  );
};

export default CommentSection;
