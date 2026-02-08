"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Subtitle } from "@/components/shared/typography";
import CommentSection from "./comment-section";
import { getPerformanceCommentsOptions } from "../query-options";

interface ContentTabsProps {
  noticeContent: React.ReactNode;
  size?: "sm" | "md" | "lg";
  performanceId: number;
  commentText: string;
  setCommentText: (text: string) => void;
  editingCommentId: number | null;
  setEditingCommentId: (id: number | null) => void;
  editingText: string;
  setEditingText: (text: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedComments: Map<number, boolean>;
  setExpandedComments: React.Dispatch<React.SetStateAction<Map<number, boolean>>>;
}

/**
 * 공연 안내/코멘트 탭 컴포넌트
 * - size에 따라 폰트 크기 조정
 */
const ContentTabs = ({
  noticeContent,
  size = "lg",
  performanceId,
  commentText,
  setCommentText,
  editingCommentId,
  setEditingCommentId,
  editingText,
  setEditingText,
  activeTab,
  setActiveTab,
  expandedComments,
  setExpandedComments
}: ContentTabsProps) => {

  const fontSize = {
    sm: "text-[14px]",
    md: "text-[16px]",
    lg: "text-[18px]"
  }[size];

  // 댓글 수 조회 (React Query 캐싱 활용)
  const { data: commentsData } = useQuery(
    getPerformanceCommentsOptions(performanceId, 0, 1)
  );
  const totalComments = commentsData?.data.total || 0;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Tab height: 2XL(80px), XL(64px), LG(60px), MD 이하(48px) */}
      <TabsList className="!w-full h-12 lg:h-15 xl:h-16 2xl:h-20 bg-white">
        <TabsTrigger
          value="notice"
          className="cursor-pointer data-[state=active]:border-b-2 data-[state=active]:border-[#FF491A] data-[state=active]:text-[#202020]"
        >
          <Subtitle className={fontSize}>공연 안내</Subtitle>
        </TabsTrigger>
        <TabsTrigger
          value="comment"
          className="cursor-pointer data-[state=active]:border-b-2 data-[state=active]:border-[#FF491A] data-[state=active]:text-[#202020]"
        >
          <Subtitle className={fontSize}>코멘트({totalComments})</Subtitle>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notice" className="mt-8 lg:mt-6">
        {noticeContent}
      </TabsContent>

      <TabsContent value="comment" className="mt-8 lg:mt-6">
        <CommentSection
          performanceId={performanceId}
          commentText={commentText}
          setCommentText={setCommentText}
          editingCommentId={editingCommentId}
          setEditingCommentId={setEditingCommentId}
          editingText={editingText}
          setEditingText={setEditingText}
          expandedComments={expandedComments}
          setExpandedComments={setExpandedComments}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
