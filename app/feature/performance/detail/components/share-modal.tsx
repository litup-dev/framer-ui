"use client";

import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { Subtitle, Description } from "@/components/shared/typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  performanceTitle: string;
  clubName: string;
  performanceId: number;
}

const ShareModal = ({
  isOpen,
  onClose,
  performanceTitle,
  clubName,
  performanceId,
}: ShareModalProps) => {
  const [showCopyToast, setShowCopyToast] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/performance/${performanceId}`
    : "";

  useEffect(() => {
    if (showCopyToast) {
      const timer = setTimeout(() => {
        setShowCopyToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopyToast]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopyToast(true);
    } catch (error) {
      console.error("URL 복사 실패:", error);
    }
  };

  const handleKakaoShare = () => {
    if (typeof window !== "undefined" && (window as any).Kakao) {
      const kakao = (window as any).Kakao;

      if (!kakao.isInitialized()) {
        kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }

      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: performanceTitle,
          description: clubName,
          imageUrl: shareUrl + "/og-image.jpg",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: "공연 보기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      console.error("Kakao SDK가 로드되지 않았습니다");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[355px] h-[260px] md:w-[495px] md:h-[305px] p-0 rounded-[8px]" showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 md:px-8 md:pt-8">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              <Subtitle className="text-[18px] md:text-[20px]">공유하기</Subtitle>
            </DialogTitle>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center transition-colors text-black-60 hover:text-black"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center flex-1 px-6 pb-6 md:px-8 md:pb-8 relative">
          {/* 복사 완료 토스트 */}
          {showCopyToast && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-[4px] text-[14px] font-medium animate-in fade-in slide-in-from-top-2 duration-200">
              URL이 복사되었습니다
            </div>
          )}

          {/* 공연 정보 */}
          <div className="text-center mb-8 md:mb-10">
            <Subtitle className="text-[22px] md:text-[20px] mb-2">
              {performanceTitle}
            </Subtitle>
            <Description className="text-[14px] md:text-[16px] font-semibold text-black-60">
              {clubName}
            </Description>
          </div>

          {/* 공유 아이콘 */}
          <div className="flex items-center gap-3">
            {/* 카카오톡 */}
            <button
              onClick={handleKakaoShare}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-14 h-14 rounded-full bg-[#F2F1EE] flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 3C5.58 3 2 5.91 2 9.5C2 11.67 3.37 13.56 5.44 14.69L4.5 17.5L7.69 15.72C8.42 15.89 9.19 16 10 16C14.42 16 18 13.09 18 9.5C18 5.91 14.42 3 10 3Z"
                    fill="#3C1E1E"
                  />
                </svg>
              </div>
            </button>

            {/* URL 복사 */}
            <button
              onClick={handleCopyUrl}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-14 h-14 rounded-full bg-[#F2F1EE] flex items-center justify-center">
                <span className="text-[12px] font-semibold text-foreground">URL</span>
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
