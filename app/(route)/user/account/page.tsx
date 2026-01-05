"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useRequireAuth } from "@/app/feature/user/hooks/useRequireAuth";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Subtitle, Description } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { GoogleIcon, KakaoIcon } from "@/app/feature/login/components/icons";
import { updateUserInfo } from "@/app/feature/user/query-options";
import { apiClient } from "@/lib/api-client";

export default function AccountPage() {
  const { session, isLoading } = useRequireAuth();
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  // 프로필 수정 mutation - 훅은 최상위에서 호출
  const updateMutation = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      alert("프로필이 수정되었습니다.");
      // 세션 갱신을 위해 페이지 새로고침
      window.location.reload();
    },
    onError: () => {
      alert("프로필 수정에 실패했습니다.");
    },
  });

  // 회원 탈퇴 mutation - 훅은 최상위에서 호출
  const withdrawMutation = useMutation({
    mutationFn: async () => {
      return apiClient.delete("/api/v1/auth/withdraw");
    },
    onSuccess: () => {
      signOut({ callbackUrl: "/" });
    },
    onError: () => {
      alert("회원 탈퇴에 실패했습니다.");
    },
  });

  useEffect(() => {
    if (session) {
      setNickname(session.nickname || "");
    }
  }, [session]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleSave = () => {
    updateMutation.mutate({
      nickname,
      bio,
    });
  };

  const handleWithdraw = () => {
    if (confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      withdrawMutation.mutate();
    }
  };

  // 소셜 로그인 제공자 정보
  const socialProvider = session.provider || "google";
  const providerName = socialProvider === "google" ? "Google" : "Kakao";

  // provider에 따라 아이콘 컴포넌트 선택
  const ProviderIcon = socialProvider === "google" ? GoogleIcon : KakaoIcon;

  return (
    <UserPageLayout
      session={session}
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
            {providerName}
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

      {/* 회원 정보 */}
      <Subtitle className="text-[16px] md:text-[20px] mt-10 md:mt-12 lg:mt-12 xl:mt-[50px] 2xl:mt-20">
        회원 정보
      </Subtitle>

      {/* 닉네임 */}
      <div className="flex mt-8 sm:mt-8 md:mt-10 xl:mt-10 2xl:mt-14 gap-10 sm:gap-10 md:gap-[110px]">
        <Description className="text-[14px] md:text-[16px] min-w-fit">
          닉네임
        </Description>
        <Input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full sm:w-[277px] md:w-[400px] h-[46px] md:h-14 px-4 md:px-5 border border-[#202020]/20 rounded-[2px] text-sm focus:outline-none focus:border-ring"
          placeholder="닉네임을 입력하세요"
        />
      </div>

      {/* Divide */}
      <Separator className="mt-6 md:mt-5 2xl:mt-7" />

      {/* 소개글 */}
      <div className="flex mt-6 sm:mt-6 md:mt-8 xl:mt-8 2xl:mt-10 gap-10 sm:gap-10 md:gap-[110px]">
        <Description className="text-sm min-w-fit">소개글</Description>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full sm:w-[277px] md:w-[400px] h-[120px] p-4 md:p-5 border border-[#202020]/20 rounded-[2px] text-sm resize-none focus:outline-none focus:border-ring"
          placeholder="소개글을 입력하세요"
        />
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end md:justify-start mt-8 sm:mt-8 md:mt-10 xl:mt-10 2xl:mt-20">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="
            bg-black text-white rounded-[4px] hover:bg-black/80
            md:bg-transparent md:border md:border-input md:shadow-xs
            md:text-foreground md:hover:bg-accent md:hover:text-accent-foreground
            md:dark:bg-input/30 md:dark:border-input md:dark:hover:bg-input/50
          "
        >
          {updateMutation.isPending ? "저장 중..." : "저장"}
        </Button>
      </div>

      {/* Divide */}
      <Separator className="mt-10 md:mt-8 2xl:mt-10" />
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
