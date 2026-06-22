"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/app/shared/components/page-wrapper";
import ViewingHistoryItem from "@/app/feature/user/components/viewing-history-item";
import CommentPagination from "@/app/feature/user/components/comment-pagination";
import Footer from "@/app/shared/components/footer";
import { Title } from "@/components/shared/typography";
import { Separator } from "@/components/ui/separator";
import { useUserPageData } from "@/app/feature/user/hooks/use-user-page-data";
import { useRedirectIfOwner } from "@/app/feature/user/hooks/use-redirect-if-owner";
import { getWishPerformsPaginatedOptions } from "@/app/feature/user/query-options";
import { WishPerformItem, PerformHistoryItem } from "@/app/feature/user/types";

interface PageProps {
  params: Promise<{ publicId: string }>;
}

type SortOrder = "latest" | "oldest";

const ITEMS_PER_PAGE = 4;

export default function OtherUserWishPerformancesPage({ params }: PageProps) {
  const [publicId, setPublicId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    params.then((p) => setPublicId(p.publicId));
  }, [params]);

  useRedirectIfOwner(publicId);

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

  const { userInfo } = useUserPageData(publicId);
  const offset = (currentPage - 1) * itemsPerPage;

  const { data, isLoading } = useQuery({
    ...getWishPerformsPaginatedOptions(publicId ?? "", offset, itemsPerPage),
    enabled: !!publicId,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder]);

  const items: WishPerformItem[] = data?.items ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const nickname = userInfo?.nickname ?? "";
  const pageTitle = nickname ? `${nickname}님이 보고 싶은 공연` : "보고 싶은 공연";

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageWrapper className="pt-4 md:pt-[120px] lg:pt-[120px] 2xl:pt-[124px]">
        <Title className="text-[20px] md:text-[24px] lg:text-[32px] xl:text-[32px] 2xl:text-[40px] tracking-[-0.04em]">
          {pageTitle}
        </Title>
        <Separator className="!h-[2px] md:!h-[3px] bg-main mt-4 md:mt-7 lg:mt-10" />

        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : (
            <>
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

              {items.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-3 md:gap-y-6 lg:gap-6 mt-4 md:mt-6">
                    {items.map((item) => (
                      <ViewingHistoryItem
                        key={item.id}
                        item={item as PerformHistoryItem}
                        isEditing={false}
                        isSelected={false}
                        onSelect={() => {}}
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
        </div>
      </PageWrapper>
      <Footer className="mt-12 md:mt-16 lg:mt-20 xl:mt-40 2xl:mt-40" />
    </>
  );
}
