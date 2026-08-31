import { apiClient } from "@/lib/api-client";
import { getImageUrl } from "@/lib/utils";
import type { Club } from "@/app/feature/club/types";
import type { AllPerformancesResponse, PerformanceItem } from "@/app/feature/all-performances/types";
import type { TaggableClub, TaggablePerform } from "./types";

// 글쓰기 태그 검색(클럽) — 신규 API 없이 기존 클럽 목록 API 재사용.
// 클럽은 최대 200개 정도라 offset 없이 한 번에 조회.
export const searchClubsForTag = async (searchKey: string): Promise<{ data: { items: Club[] } }> => {
  const params = new URLSearchParams({ limit: "100" });
  if (searchKey.trim()) params.set("searchKey", searchKey.trim());
  return apiClient.get(`/api/v1/clubs?${params.toString()}`);
};

// 글쓰기 태그 검색(공연) — 기존 전체 공연 검색 API 재사용.
// 공연 후기 태그는 이미 지나간 공연을 리뷰하는 것이므로 timeFilter=past로 고정.
// limit 기본값이 1000(캘린더용)이라 태그 검색에서는 반드시 작은 값을 명시해야 함.
export const searchPerformancesForTag = async (
  keyword: string,
  offset = 0,
  limit = 20,
): Promise<AllPerformancesResponse> => {
  const params = new URLSearchParams({ timeFilter: "past", offset: String(offset), limit: String(limit) });
  if (keyword.trim()) params.set("keyword", keyword.trim());
  return apiClient.get(`/api/v1/performances/search?${params.toString()}`);
};

function mainImagePath(images?: { filePath: string; isMain?: boolean }[]): string | undefined {
  if (!images || images.length === 0) return undefined;
  return (images.find((i) => i.isMain) ?? images[0]).filePath;
}

export function toTaggableClub(club: Club): TaggableClub {
  return {
    id: club.id,
    name: club.name,
    address: club.address,
    imageUrl: getImageUrl(mainImagePath(club.images)),
  };
}

export function toTaggablePerform(perform: PerformanceItem): TaggablePerform {
  return {
    id: perform.id,
    title: perform.title,
    artistLabel: perform.artists.map((a) => a.name).join(", "),
    performDate: perform.performDate,
    imageUrl: getImageUrl(mainImagePath(perform.images)),
  };
}
