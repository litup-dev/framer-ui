"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import PrivacySettingGroup from "@/app/feature/user/components/privacy-setting-group";
import { Separator } from "@/components/ui/separator";
import { HandMetal, Ticket, Star } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { PrivacyLevel } from "@/app/feature/user/types";
import {
  getPrivacySettingsOptions,
  updatePrivacySettings,
} from "@/app/feature/user/query-options";

interface PrivacySettings {
  attendance: PrivacyLevel;
  performHistory: PrivacyLevel;
  favoriteClubs: PrivacyLevel;
}

const settingLabels: {
  key: keyof PrivacySettings;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "attendance", label: "보고 싶은 공연", icon: HandMetal },
  { key: "performHistory", label: "관람 기록", icon: Ticket },
  { key: "favoriteClubs", label: "관심 클럽", icon: Star },
];

export default function PrivacyPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useUserStore();
  const [settings, setSettings] = useState<PrivacySettings>({
    attendance: "public",
    performHistory: "public",
    favoriteClubs: "public",
  });

  // 공개범위 설정 조회
  const { data: privacyData, isLoading } = useQuery({
    ...getPrivacySettingsOptions(),
    enabled: isAuthenticated,
  });

  // 공개범위 설정 수정 mutation
  const updateMutation = useMutation({
    mutationFn: updatePrivacySettings,
    onSuccess: () => {
      // 성공 시 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["privacySettings"] });
    },
    onError: () => {
      alert("설정 변경에 실패했습니다.");
    },
  });

  // API 데이터로 초기화
  useEffect(() => {
    if (privacyData) {
      setSettings({
        attendance: privacyData.attendance,
        performHistory: privacyData.performHistory,
        favoriteClubs: privacyData.favoriteClubs,
      });
    }
  }, [privacyData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSettingChange = (
    key: keyof PrivacySettings,
    value: PrivacyLevel
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // 즉시 API 호출
    updateMutation.mutate({
      attendance: key === "attendance" ? value : settings.attendance,
      performHistory:
        key === "performHistory" ? value : settings.performHistory,
      favoriteClubs: key === "favoriteClubs" ? value : settings.favoriteClubs,
    });
  };

  return (
    <UserPageLayout
      title="공개범위 설정"
      contentTopMargin={{
        sm: "mt-8",
        md: "md:mt-[68px]",
        lg: "lg:mt-20",
        xl: "xl:mt-20",
        "2xl": "2xl:mt-20",
      }}
    >
      {/* 2xl: 가로 3열 배치 */}
      <div className="hidden 2xl:flex flex-row gap-[90px]">
        {settingLabels.map((item) => (
          <PrivacySettingGroup
            key={item.key}
            title={item.label}
            selectedValue={settings[item.key]}
            onChange={(value) => handleSettingChange(item.key, value)}
            name={item.key}
            layout="2xl"
            icon={item.icon}
          />
        ))}
      </div>

      {/* xl: 세로 배치 */}
      <div className="hidden xl:flex 2xl:hidden flex-col gap-20">
        {settingLabels.map((item) => (
          <PrivacySettingGroup
            key={item.key}
            title={item.label}
            selectedValue={settings[item.key]}
            onChange={(value) => handleSettingChange(item.key, value)}
            name={item.key}
            layout="xl"
            icon={item.icon}
          />
        ))}
      </div>

      {/* lg: 1 2 / 3 배치 */}
      <div className="hidden lg:flex xl:hidden flex-col gap-20">
        {/* 첫 번째 줄: 보고 싶은 공연, 관람 기록 */}
        <div className="flex flex-row gap-20">
          {settingLabels.slice(0, 2).map((item) => (
            <PrivacySettingGroup
              key={item.key}
              title={item.label}
              selectedValue={settings[item.key]}
              onChange={(value) => handleSettingChange(item.key, value)}
              name={item.key}
              layout="lg"
              icon={item.icon}
            />
          ))}
        </div>

        {/* 두 번째 줄: 관심 클럽 */}
        <PrivacySettingGroup
          title={settingLabels[2].label}
          selectedValue={settings[settingLabels[2].key]}
          onChange={(value) =>
            handleSettingChange(settingLabels[2].key, value)
          }
          name={settingLabels[2].key}
          layout="lg"
          icon={settingLabels[2].icon}
        />
      </div>

      {/* md: 세로 배치 */}
      <div className="hidden md:flex lg:hidden flex-col gap-14">
        {settingLabels.map((item) => (
          <PrivacySettingGroup
            key={item.key}
            title={item.label}
            selectedValue={settings[item.key]}
            onChange={(value) => handleSettingChange(item.key, value)}
            name={item.key}
            layout="md"
            icon={item.icon}
          />
        ))}
      </div>

      {/* sm: 라디오 버튼 앞에, divide로 구분 */}
      <div className="flex md:hidden flex-col">
        {settingLabels.map((item, index) => (
          <div key={item.key}>
            <PrivacySettingGroup
              title={item.label}
              selectedValue={settings[item.key]}
              onChange={(value) => handleSettingChange(item.key, value)}
              name={item.key}
              layout="sm"
              icon={item.icon}
            />
            {/* Divide - 마지막 항목이 아닐 때만 표시 */}
            {index < settingLabels.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </UserPageLayout>
  );
}
