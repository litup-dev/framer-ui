"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import ViewingHistoryItem from "@/app/feature/user/components/viewing-history-item";
import ViewingHistoryEditControls from "@/app/feature/user/components/viewing-history-edit-controls";
import CommentPagination from "@/app/feature/user/components/comment-pagination";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import {
  getWishPerformsPaginatedOptions,
  deleteWishPerforms,
} from "@/app/feature/user/query-options";
import { WishPerformItem, PerformHistoryItem } from "@/app/feature/user/types";

type SortOrder = "latest" | "oldest";

const ITEMS_PER_PAGE = 4;

export default function WishPerformancesPage() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const publicId = user?.publicId || "";

  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const update = () =>
      setItemsPerPage(window.innerWidth >= 768 ? 8 : 4);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const offset = (currentPage - 1) * itemsPerPage;

  const sort = sortOrder === "latest" ? "-createdAt" : "+createdAt";

  const { data, isLoading } = useQuery({
    ...getWishPerformsPaginatedOptions(publicId, offset, itemsPerPage, sort),
    enabled: !!publicId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWishPerforms,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishPerforms", publicId] });
      queryClient.invalidateQueries({ queryKey: ["userStats", publicId] });
      setSelectedItems([]);
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (!isEditing) setSelectedItems([]);
  }, [isEditing]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder]);

  const items: WishPerformItem[] = data?.items ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <UserPageLayout
      title="보고싶은 공연"
      contentTopMargin={{
        sm: "mt-4",
        md: "md:mt-4",
        lg: "lg:mt-4",
        xl: "xl:mt-4",
        "2xl": "2xl:mt-4",
      }}
    >
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            {/* 좌측: 편집 시 전체선택, 아닐 때 정렬 */}
            {isEditing ? (
              <ViewingHistoryEditControls
                selectedCount={selectedItems.length}
                totalCount={items.length}
                allSelected={
                  selectedItems.length === items.length && items.length > 0
                }
                onSelectAll={(checked) =>
                  setSelectedItems(checked ? items.map((i) => i.id) : [])
                }
                onDelete={() => {}}
                hideDeleteButton
              />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 font-semibold text-[14px] xl:text-[16px] hover:text-black transition-colors">
                    <span>{sortOrder === "latest" ? "최신순" : "오래된순"}</span>
                    <Image
                      src="/images/arrow-down.svg"
                      alt="화살표"
                      width={20}
                      height={20}
                      className="w-4 h-4 xl:w-5 xl:h-5"
                    />
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

            {/* 우측: 편집/확인 + 편집 시 선택항목 삭제 */}
            {items.length > 0 && (
              <div className="relative">
                <Button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setSelectedItems([]);
                  }}
                  variant="outline"
                  className="border-none shadow-none font-bold text-muted-foreground text-[14px] md:text-[16px] lg:text-[20px] p-0 h-auto"
                >
                  {isEditing ? "확인" : "편집"}
                </Button>
                {isEditing && (
                  <button
                    onClick={() => {
                      if (selectedItems.length > 0)
                        deleteMutation.mutate(selectedItems);
                    }}
                    disabled={selectedItems.length === 0}
                    className="absolute right-0 top-full mt-2 whitespace-nowrap text-[14px] xl:text-[16px] font-semibold text-main hover:text-main/70 disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    선택항목 삭제
                  </button>
                )}
              </div>
            )}
          </div>

          {items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4 md:gap-x-3 md:gap-y-6 lg:gap-6 xl:gap-6 2xl:gap-x-5 2xl:gap-y-8 mt-4 md:mt-6">
                {items.map((item) => (
                  <ViewingHistoryItem
                    key={item.id}
                    item={item as PerformHistoryItem}
                    isEditing={isEditing}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={(id) =>
                      setSelectedItems((prev) =>
                        prev.includes(id)
                          ? prev.filter((x) => x !== id)
                          : [...prev, id],
                      )
                    }
                  />
                ))}
              </div>
              <CommentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center mt-20 text-muted-foreground">
              보고싶은 공연이 없습니다.
            </div>
          )}
        </>
      )}
    </UserPageLayout>
  );
}
