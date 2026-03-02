"use client";

import { signOut } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import { Subtitle, Description } from "@/components/shared/typography";
import Image from "next/image";
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
      <Subtitle className="text-[16px] md:text-[20px] tracking-[-0.04em]">로그인 정보</Subtitle>
      <div className="h-[88px] md:h-24 bg-[#F5F5F5] rounded-[3px] flex items-center justify-between px-5 py-5 md:px-6 md:py-6 md:pr-10 mt-4 sm:mt-4 md:mt-6 xl:mt-6 2xl:mt-6">
        <div className="flex items-center gap-3 md:gap-4">
          {/* 유저 아바타 아이콘 */}
          <Image
            src="/images/user/user-avatar.svg"
            alt="사용자"
            width={48}
            height={48}
            className="w-12 h-12"
          />
          {/* publicId */}
          <Description className="text-[16px] md:text-[18px] font-medium leading-[100%] tracking-[-0.04em]">
            {user?.publicId || ""}
          </Description>
        </div>
        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="text-[12px] md:text-[16px] text-[#171717]/60 underline underline-offset-[4px] hover:text-black transition-colors"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-10 md:mt-12 2xl:mt-20">
        <button
          onClick={handleWithdraw}
          className="text-sm text-[#202020]/50 underline underline-offset-[4px] hover:text-black transition-colors"
          disabled={withdrawMutation.isPending}
        >
          {withdrawMutation.isPending ? "처리 중..." : "회원 탈퇴하기"}
        </button>
      </div>
    </UserPageLayout>
  );
}
