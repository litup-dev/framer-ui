"use client";

import { useState, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Ticket, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SectionHeader from "./section-header";
import LoadMoreButton from "./load-more-button";
import ViewingHistoryEditControls from "./viewing-history-edit-controls";
import ViewingHistoryItem from "./viewing-history-item";
import {
  getPerformHistoryOptions,
  deletePerformHistory,
} from "@/app/feature/user/query-options";
import { PerformHistoryItem } from "@/app/feature/user/types";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";

interface ViewingHistoryProps {
  className?: string;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  publicId: string;
  isOwner?: boolean;
}

export default function ViewingHistory({
  className,
  isEditing: externalIsEditing,
  setIsEditing: externalSetIsEditing,
  publicId,
  isOwner = true,
}: ViewingHistoryProps) {
  const queryClient = useQueryClient();
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  // API 호출: 관람 기록
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery(getPerformHistoryOptions(publicId));

  const errorMessage = useApiErrorMessage(error);

  // 관람 기록 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: deletePerformHistory,
    onSuccess: () => {
      // 성공 시 관람 기록 목록 및 통계 refetch
      queryClient.invalidateQueries({ queryKey: ["performHistory", publicId] });
      queryClient.invalidateQueries({ queryKey: ["userStats", publicId] });
      setSelectedItems([]);
      setIsEditing(false);
    },
  });

  // props로 받은 isEditing을 사용하거나, 내부 state 사용
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;

  // 편집 모드가 종료되면 선택 항목 초기화
  useEffect(() => {
    if (!isEditing) {
      setSelectedItems([]);
    }
  }, [isEditing]);

  // API 데이터를 평탄화
  const allHistoryItems =
    data?.pages.flatMap(
      (page: { items: PerformHistoryItem[] }) => page.items
    ) ?? [];
  const totalCount = data?.pages[0]?.total ?? 0;

  const handleCheckboxChange = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      deleteMutation.mutate(selectedItems);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col ${className || ""}`}>
        <SectionHeader
          icon={Ticket}
          title="관람 기록"
          iconClassName="w-8 h-8 lg:w-9 lg:h-9 fill-black text-white stroke-1"
        />
        <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (isError && errorMessage) {
    return (
      <div className={`flex flex-col ${className || ""}`}>
        <SectionHeader
          icon={Ticket}
          title="관람 기록"
          iconClassName="w-8 h-8 lg:w-9 lg:h-9 fill-black text-white stroke-1"
        />
        <div className="col-span-full text-center py-8 text-muted-foreground">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className || ""}`}>
      <SectionHeader
        icon={Ticket}
        title={`관람 기록 (${totalCount})`}
        iconClassName="w-8 h-8 lg:w-9 lg:h-9 fill-black text-white stroke-1"
        action={
          isOwner && totalCount > 0 ? (
            <Button
              onClick={() => {
                setIsEditing(!isEditing);
                setSelectedItems([]);
              }}
              variant="outline"
              className="border-none shadow-none font-bold text-muted-foreground text-[14px] md:text-[16px] lg:text-[20px]"
            >
              {isEditing ? "확인" : "편집"}
            </Button>
          ) : null
        }
      />

      {/* 서브 헤더 - 타이틀 하단과 간격: 2xl/xl/lg 16px, md/sm 12px */}
      <div className="flex items-center justify-between mt-3 lg:mt-4">
        {isEditing ? (
          <ViewingHistoryEditControls
            selectedCount={selectedItems.length}
            totalCount={totalCount}
            allSelected={selectedItems.length === totalCount && totalCount > 0}
            onSelectAll={(checked) => {
              if (checked) {
                setSelectedItems(
                  allHistoryItems.map((item: PerformHistoryItem) => item.id)
                );
              } else {
                setSelectedItems([]);
              }
            }}
            onDelete={handleDelete}
          />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 font-semibold text-[14px] xl:text-[16px] hover:text-black transition-colors">
                <span>{sortOrder === "latest" ? "최신순" : "오래된순"}</span>
                <ChevronDown className="w-4 h-4 xl:w-5 xl:h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortOrder("latest")}>
                최신순
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                오래된순
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* 관람 기록 목록 - 2xl/md: 2개씩 가로, xl/lg/sm: 1개씩 세로 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4 mt-4">
        {allHistoryItems.length > 0 ? (
          allHistoryItems.map((item: PerformHistoryItem) => (
            <ViewingHistoryItem
              key={item.id}
              item={item}
              isEditing={isEditing}
              isSelected={selectedItems.includes(item.id)}
              onSelect={handleCheckboxChange}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            관람 기록이 없습니다.
          </div>
        )}
      </div>

      {hasNextPage && <LoadMoreButton onClick={handleLoadMore} />}
    </div>
  );
}
