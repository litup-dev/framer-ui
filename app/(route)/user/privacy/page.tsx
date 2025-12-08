"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/shared/components/page-wrapper";
import UserProfile from "@/app/feature/user/components/user-profile";
import UserSidebarMenu from "@/app/feature/user/components/user-sidebar-menu";
import { Title } from "@/components/shared/typography";

type PrivacyLevel = "public" | "friends" | "private";

interface PrivacySettings {
  wantToWatch: PrivacyLevel;
  viewingHistory: PrivacyLevel;
  favoriteClubs: PrivacyLevel;
}

export default function PrivacyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    wantToWatch: "public",
    viewingHistory: "public",
    favoriteClubs: "public",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const privacyOptions = [
    { value: "public" as PrivacyLevel, label: "전체 공개" },
    { value: "friends" as PrivacyLevel, label: "친구 공개" },
    { value: "private" as PrivacyLevel, label: "나만 보기" },
  ];

  const settingLabels = [
    { key: "wantToWatch" as keyof PrivacySettings, label: "보고 싶은 공연" },
    { key: "viewingHistory" as keyof PrivacySettings, label: "관람 기록" },
    { key: "favoriteClubs" as keyof PrivacySettings, label: "관심 클럽" },
  ];

  const handleSettingChange = (key: keyof PrivacySettings, value: PrivacyLevel) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    // TODO: API 호출로 설정 저장
  };

  // 2xl: 가로 3열 배치
  const PrivacyContent2XL = () => (
    <div className="hidden 2xl:flex flex-row gap-[90px]">
      {settingLabels.map((item) => (
        <div key={item.key} className="flex flex-col gap-10">
          <h3 className="font-bold text-base">{item.label}</h3>
          <div className="flex flex-col gap-4">
            {privacyOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between w-[378px] h-[60px] px-6 py-5 border border-[#202020]/20 rounded cursor-pointer hover:border-[#202020]/30 transition-colors"
              >
                <span className="text-sm text-[#202020]/80">{option.label}</span>
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name={item.key}
                    value={option.value}
                    checked={settings[item.key] === option.value}
                    onChange={() => handleSettingChange(item.key, option.value)}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border border-[#202020]/20 flex items-center justify-center">
                    {settings[item.key] === option.value && (
                      <div className="w-[10px] h-[10px] rounded-full bg-main" />
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // xl: 세로 배치
  const PrivacyContentXL = () => (
    <div className="hidden xl:flex 2xl:hidden flex-col gap-20">
      {settingLabels.map((item) => (
        <div key={item.key} className="flex flex-col gap-10">
          <h3 className="font-bold text-base">{item.label}</h3>
          <div className="flex flex-col gap-4">
            {privacyOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between w-[378px] h-[60px] px-6 py-5 border border-[#202020]/20 rounded cursor-pointer hover:border-[#202020]/30 transition-colors"
              >
                <span className="text-sm text-[#202020]/80">{option.label}</span>
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name={item.key}
                    value={option.value}
                    checked={settings[item.key] === option.value}
                    onChange={() => handleSettingChange(item.key, option.value)}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border border-[#202020]/20 flex items-center justify-center">
                    {settings[item.key] === option.value && (
                      <div className="w-[10px] h-[10px] rounded-full bg-main" />
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // lg: 1 2 / 3 배치
  const PrivacyContentLG = () => (
    <div className="hidden lg:flex xl:hidden flex-col gap-20">
      {/* 첫 번째 줄: 보고 싶은 공연, 관람 기록 */}
      <div className="flex flex-row gap-20">
        {settingLabels.slice(0, 2).map((item) => (
          <div key={item.key} className="flex flex-col gap-10">
            <h3 className="font-bold text-base">{item.label}</h3>
            <div className="flex flex-col gap-4">
              {privacyOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center justify-between w-[412px] h-[60px] px-6 py-5 border border-[#202020]/20 rounded cursor-pointer hover:border-[#202020]/30 transition-colors"
                >
                  <span className="text-sm text-[#202020]/80">{option.label}</span>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name={item.key}
                      value={option.value}
                      checked={settings[item.key] === option.value}
                      onChange={() => handleSettingChange(item.key, option.value)}
                      className="sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border border-[#202020]/20 flex items-center justify-center">
                      {settings[item.key] === option.value && (
                        <div className="w-[10px] h-[10px] rounded-full bg-main" />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 두 번째 줄: 관심 클럽 */}
      <div className="flex flex-col gap-10">
        <h3 className="font-bold text-base">{settingLabels[2].label}</h3>
        <div className="flex flex-col gap-4">
          {privacyOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between w-[412px] h-[60px] px-6 py-5 border border-[#202020]/20 rounded cursor-pointer hover:border-[#202020]/30 transition-colors"
            >
              <span className="text-sm text-[#202020]/80">{option.label}</span>
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name={settingLabels[2].key}
                  value={option.value}
                  checked={settings[settingLabels[2].key] === option.value}
                  onChange={() => handleSettingChange(settingLabels[2].key, option.value)}
                  className="sr-only"
                />
                <div className="w-5 h-5 rounded-full border border-[#202020]/20 flex items-center justify-center">
                  {settings[settingLabels[2].key] === option.value && (
                    <div className="w-[10px] h-[10px] rounded-full bg-main" />
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // md: 세로 배치, 664x60, padding 20px
  const PrivacyContentMD = () => (
    <div className="hidden md:flex lg:hidden flex-col gap-14">
      {settingLabels.map((item) => (
        <div key={item.key} className="flex flex-col gap-6">
          <h3 className="font-bold text-base">{item.label}</h3>
          <div className="flex flex-col gap-3">
            {privacyOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between w-[664px] h-[60px] p-5 border border-[#202020]/20 rounded cursor-pointer hover:border-[#202020]/30 transition-colors"
              >
                <span className="text-sm text-[#202020]/80">{option.label}</span>
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name={item.key}
                    value={option.value}
                    checked={settings[item.key] === option.value}
                    onChange={() => handleSettingChange(item.key, option.value)}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border border-[#202020]/20 flex items-center justify-center">
                    {settings[item.key] === option.value && (
                      <div className="w-[10px] h-[10px] rounded-full bg-main" />
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // sm, 기본: 박스 없음, 라디오 버튼 앞에, divide로 구분
  const PrivacyContentSM = () => (
    <div className="flex md:hidden flex-col">
      {settingLabels.map((item, index) => (
        <div key={item.key}>
          <div className="flex flex-col gap-4 py-6">
            <h3 className="font-bold text-base">{item.label}</h3>
            <div className="flex flex-col gap-3">
              {privacyOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name={item.key}
                      value={option.value}
                      checked={settings[item.key] === option.value}
                      onChange={() => handleSettingChange(item.key, option.value)}
                      className="sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border border-[#202020]/20 flex items-center justify-center">
                      {settings[item.key] === option.value && (
                        <div className="w-[10px] h-[10px] rounded-full bg-main" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-[#202020]/80">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Divide - 마지막 항목이 아닐 때만 표시 */}
          {index < settingLabels.length - 1 && (
            <div className="h-px bg-[#202020]/10" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <PageWrapper className="pt-6 sm:pt-[104px] 2xl:pt-[124px]">
      {/* 1280px 이상: 2열 레이아웃 - 프로필 영역 표시 */}
      <div className="hidden xl:flex xl:flex-row gap-6 xl:gap-10 2xl:gap-[85px]">
        {/* 좌측: 프로필 섹션 + 메뉴 - 너비: xl 330px, 2xl 365px */}
        <div className="w-full xl:w-[330px] 2xl:w-[365px] flex flex-col">
          {/* 타이틀 높이만큼 공백 추가 */}
          <div className="mb-6">
            <div className="font-bold text-[24px] xl:text-[28px] invisible">
              공개범위 설정
            </div>
          </div>

          <UserProfile
            session={session}
            isOwner={true}
            isEditing={isProfileEditing}
            setIsEditing={setIsProfileEditing}
          />

          {/* 사이드바 메뉴 - 간격: xl 80px, 2xl 100px */}
          <UserSidebarMenu className="xl:mt-20 2xl:mt-[100px]" />
        </div>

        {/* 우측: 페이지 헤더 + 컨텐츠 */}
        <div className="w-full xl:w-3/4 2xl:w-[1315px] flex flex-col">
          <div className="flex flex-col">
            <Title className="text-black">공개범위 설정</Title>
            <div className="h-[3px] bg-main mt-4 md:mt-7 lg:mt-10" />
          </div>

          {/* 공개범위 설정 컨텐츠 영역 */}
          <div className="mt-12 xl:mt-16 2xl:mt-20">
            <PrivacyContent2XL />
            <PrivacyContentXL />
          </div>
        </div>
      </div>

      {/* 1024~1279px: 1열 레이아웃 - 프로필 영역 숨김 */}
      <div className="hidden lg:flex xl:hidden flex-col gap-6">
        <div className="flex flex-col">
          <Title className="text-black">공개범위 설정</Title>
          <div className="h-[3px] bg-main mt-10" />
        </div>

        {/* 공개범위 설정 컨텐츠 영역 */}
        <div className="mt-14">
          <PrivacyContentLG />
        </div>

        {/* 사이드바 메뉴는 가장 하단 */}
        <UserSidebarMenu className="mt-12 md:mt-16 lg:mt-20" />
      </div>

      {/* 768~1023px: md 레이아웃 - 프로필 영역 숨김 */}
      <div className="hidden md:flex lg:hidden flex-col gap-6">
        <div className="flex flex-col">
          <Title className="text-black">공개범위 설정</Title>
          <div className="h-[3px] bg-main mt-7" />
        </div>

        {/* 공개범위 설정 컨텐츠 영역 - title divide와 권한 title 간격 56px */}
        <div className="mt-14">
          <PrivacyContentMD />
        </div>

        {/* 사이드바 메뉴는 가장 하단 */}
        <UserSidebarMenu className="mt-16" />
      </div>

      {/* 767px 이하: sm, 기본 레이아웃 - 프로필 영역 숨김 */}
      <div className="flex md:hidden flex-col gap-6">
        <div className="flex flex-col">
          <Title className="text-black">공개범위 설정</Title>
          <div className="h-[3px] bg-main mt-4" />
        </div>

        {/* 공개범위 설정 컨텐츠 영역 */}
        <PrivacyContentSM />

        {/* 사이드바 메뉴는 가장 하단 */}
        <UserSidebarMenu className="mt-12" />
      </div>
    </PageWrapper>
  );
}
