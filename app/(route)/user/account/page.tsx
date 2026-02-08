"use client";

import { signOut } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import { Subtitle, Description } from "@/components/shared/typography";
import { GoogleIcon, KakaoIcon } from "@/app/feature/login/components/icons";
import { apiClient } from "@/lib/api-client";
import { useUserStore } from "@/store/user-store";

export default function AccountPage() {
  const { user } = useUserStore();

  // 회원 탈퇴 mutation - 훅은 최상위에서 호출
  const withdrawMutation = useMutation({
    mutationFn: async () => {
      return apiClient.delete("/api/v1/auth/withdraw", {});
    },
    onSuccess: () => {
      signOut({ callbackUrl: "/" });
    },
    onError: () => {
      alert("회원 탈퇴에 실패했습니다.");
    },
  });

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleWithdraw = () => {
    if (confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      withdrawMutation.mutate();
    }
  };

  // 소셜 로그인 제공자 정보
  const socialCode = user?.socialCode || "google";
  const socialName = user?.socialName || "Google";

  // socialCode에 따라 아이콘 컴포넌트 선택
  const ProviderIcon = socialCode === "google" ? GoogleIcon : KakaoIcon;

  return (
    <UserPageLayout
      title="회원정보 관리"
      contentTopMargin={{
        sm: "mt-10",
        md: "mt-12",
        lg: "mt-12",
        xl: "mt-12",
        "2xl": "mt-20",
      }}
    >
      {/* 로그인 정보 */}
      <Subtitle className="text-[16px] md:text-[20px]">로그인 정보</Subtitle>
      <div className="h-[88px] md:h-24 bg-[#F5F5F5] rounded-[3px] flex items-center justify-between px-5 py-5 md:px-6 md:py-6 md:pr-10 mt-4 sm:mt-4 md:mt-6 xl:mt-6 2xl:mt-6">
        <div className="flex items-center gap-3 md:gap-4">
          {/* 소셜 아이콘 */}
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <ProviderIcon />
          </div>
          {/* 소셜명 */}
          <Description as="span" className="text-sm">
            {socialName}
          </Description>
        </div>
        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="text-[12px] md:text-[16px] text-[#202020]/60 underline hover:text-black transition-colors"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-10 md:mt-12 2xl:mt-20">
        <button
          onClick={handleWithdraw}
          className="text-sm text-[#202020]/60 underline hover:text-black transition-colors"
          disabled={withdrawMutation.isPending}
        >
          {withdrawMutation.isPending ? "처리 중..." : "회원 탈퇴하기"}
        </button>
      </div>
    </UserPageLayout>
  );
}
