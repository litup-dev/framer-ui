"use client";

import { useState } from "react";
import { ChevronLeft, Share2, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isAfter, parseISO } from "date-fns";
import { useToggleAttendance } from "../query-options";
import { useCommonModalStore } from "@/store/common-modal-store";
import ShareModal from "./share-modal";

interface DetailMobileHeaderProps {
  performanceId: number;
  performDate: string;
  isAttend: boolean;
  performanceTitle: string;
  clubName: string;
}

const DetailMobileHeader = ({ performanceId, performDate, isAttend, performanceTitle, clubName }: DetailMobileHeaderProps) => {
  const router = useRouter();
  const { status } = useSession();
  const toggleAttendMutation = useToggleAttendance();
  const { openModal } = useCommonModalStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const isFutureEvent = isAfter(parseISO(performDate), new Date());

  const showLoginModal = () => {
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

  const handleAttend = () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    toggleAttendMutation.mutate(performanceId);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex justify-between items-center h-16 py-3.5 px-5">
      <ChevronLeft className="w-5 h-5 cursor-pointer" onClick={handleBack} />
      <div className="flex gap-2">
        <div
          className={`flex items-center text-subtitle-14 px-4 py-2.5 rounded-[4px] cursor-pointer ${
            isAttend
              ? "border border-main bg-white text-main"
              : "bg-main text-[#fff]"
          }`}
          onClick={handleAttend}
        >
          {isFutureEvent ? (isAttend ? "기대돼요" : "보고 싶어요") : (isAttend ? "관람했어요" : "관람했어요")}
          {isAttend ? <Check className="h-4 w-4 ml-1" /> : <Plus className="h-4 w-4 ml-1" />}
        </div>

        <div
          className="px-4 py-2.5 bg-[#F2F1EE] rounded-[4px] flex items-center cursor-pointer"
          onClick={() => setIsShareModalOpen(true)}
        >
          <Share2 className="w-4 h-4" />
        </div>
      </div>

      {/* 공유하기 모달 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        performanceTitle={performanceTitle}
        clubName={clubName}
        performanceId={performanceId}
      />
    </div>
  );
};

export default DetailMobileHeader;
