"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/shared/typography";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HistoryItem {
  id: string;
  posterId?: string;
  title: string;
  venue: string;
  artists: string[];
  date: string;
}

interface ViewingHistoryProps {
  className?: string;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

export default function ViewingHistory({ className, isEditing: externalIsEditing, setIsEditing: externalSetIsEditing }: ViewingHistoryProps) {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(4);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  // props로 받은 isEditing을 사용하거나, 내부 state 사용
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;

  // 편집 모드가 종료되면 선택 항목 초기화
  useEffect(() => {
    if (!isEditing) {
      setSelectedItems([]);
    }
  }, [isEditing]);

  // 임시 데이터
  const allHistoryItems: HistoryItem[] = [
    {
      id: "1",
      title: "나고야 토모로 함양에 Sways HBD",
      venue: "나고야 그랜드슬램",
      artists: ["아티스트 1", "아티스트 2"],
      date: "2025-04-22 - 2025-04-30",
    },
    {
      id: "2",
      title: "나고야 토모로 함양에 Sways HBD",
      venue: "나고야 그랜드슬램",
      artists: ["아티스트 1"],
      date: "2025-04-22 - 2025-04-30",
    },
    {
      id: "3",
      title: "나고야 토모로 함양에 Sways HBD",
      venue: "수원대 로얄반",
      artists: ["아티스트 1", "아티스트 2", "아티스트 3"],
      date: "2025-04-22 - 2025-04-30",
    },
    {
      id: "4",
      title: "나고야 토모로 함양에 Sways HBD",
      venue: "수원대 로얄반",
      artists: ["아티스트 1"],
      date: "2025-04-22 - 2025-04-30",
    },
  ];

  const displayedItems = allHistoryItems.slice(0, displayCount);
  const hasMore = displayCount < allHistoryItems.length;

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDelete = () => {
    console.log("삭제할 항목:", selectedItems);
    setSelectedItems([]);
    setIsEditing(false);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 4);
  };

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {/* 헤더 */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <Title className="text-black">관람 기록 ({allHistoryItems.length})</Title>
          <Button
            onClick={() => {
              setIsEditing(!isEditing);
              setSelectedItems([]);
            }}
            variant="outline"
            size="sm"
            className="border-none shadow-none"
          >
            {isEditing ? "확인" : "편집"}
          </Button>
        </div>
        {/* 주황색 구분선 - 높이 3px */}
        <div className="h-[3px] bg-main mt-3" />
      </div>

      {/* 서브 헤더 - 타이틀 하단과 간격: 2xl/xl/lg 16px, md/sm 12px */}
      <div className="flex items-center justify-between mt-3 lg:mt-4">
        {isEditing ? (
          // 편집 모드: 체크박스 + 선택 개수 + 선택항목 삭제 버튼
          <>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedItems.length === allHistoryItems.length && allHistoryItems.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedItems(allHistoryItems.map(item => item.id));
                  } else {
                    setSelectedItems([]);
                  }
                }}
                className="w-[15px] h-[15px] lg:w-[18px] lg:h-[18px] 2xl:w-[18px] 2xl:h-[18px] border-[#222222]/20 rounded-sm data-[state=checked]:bg-transparent data-[state=checked]:border-[#222222]/20 data-[state=checked]:text-[#202020]/80 shadow-none"
              />
              <span className="text-sm text-muted-foreground">
                {selectedItems.length}개 선택
              </span>
            </div>
            <button
              onClick={handleDelete}
              disabled={selectedItems.length === 0}
              className="text-sm font-medium text-main hover:text-main/70 disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              선택항목 삭제
            </button>
          </>
        ) : (
          // 기본 모드: 정렬 조건 팝오버
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm hover:text-black transition-colors">
                <span>{sortOrder === "latest" ? "최신순" : "오래된순"}</span>
                <ChevronDown className="w-4 h-4" />
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
        {displayedItems.map((item) => (
          <div key={item.id} className="flex gap-3 lg:gap-6 h-[125px] lg:h-[175px]">
            {/* 좌측: 포스터 이미지 - 2xl/xl/lg: 140x175, md/sm: 100x125 */}
            <div className="relative w-[100px] h-[125px] lg:w-[140px] lg:h-[175px] bg-muted rounded flex-shrink-0">
              {/* 편집 모드: 체크박스 (포스터 내 좌측 상단) */}
              {isEditing && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleCheckboxChange(item.id)}
                    className="w-[15px] h-[15px] lg:w-[18px] lg:h-[18px] 2xl:w-[18px] 2xl:h-[18px] border-[#222222]/20 rounded-sm data-[state=checked]:bg-transparent data-[state=checked]:border-[#222222]/20 data-[state=checked]:text-[#202020]/80 shadow-none"
                  />
                </div>
              )}
              {item.posterId ? (
                <Image
                  src={item.posterId}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  이미지
                </div>
              )}
            </div>

            {/* 우측: 정보 - 상하 padding 8px */}
            <div className="flex-1 flex flex-col py-2">
              {/* 클럽 위치 */}
              <p className="text-xs text-muted-foreground">
                부산 오염거리드
              </p>
              {/* 공연 타이틀 - 간격: 2xl/xl/lg 10px, md/sm 8px */}
              <h3 className="font-medium text-sm line-clamp-1 mt-2 lg:mt-[10px]">{item.title}</h3>
              {/* 아티스트 - 간격: 2xl/xl/lg 10px, md/sm 8px */}
              <p className="text-xs text-muted-foreground mt-2 lg:mt-[10px]">
                {item.artists.join(", ")}
              </p>
              {/* 공연 날짜 - 간격: 2xl/xl/lg 67px, md/sm 42px */}
              <p className="text-xs text-muted-foreground mt-[42px] lg:mt-[67px]">{item.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 - 간격: 2xl 56px, xl/lg/md 40px, sm 24px */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="flex items-center justify-center gap-1 py-2 text-sm text-muted-foreground hover:text-black transition-colors mt-6 md:mt-10 xl:mt-10 2xl:mt-14"
        >
          더보기
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
