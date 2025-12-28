"use client";

import { useState } from "react";
import { useRequireAuth } from "@/app/feature/user/hooks/useRequireAuth";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import PrivacySettingGroup from "@/app/feature/user/components/privacy-setting-group";
import { Separator } from "@/components/ui/separator";
import { HandMetal, Ticket, Star } from "lucide-react";
import { LucideIcon } from "lucide-react";

type PrivacyLevel = "public" | "friends" | "private";

interface PrivacySettings {
  wantToWatch: PrivacyLevel;
  viewingHistory: PrivacyLevel;
  favoriteClubs: PrivacyLevel;
}

const settingLabels: {
  key: keyof PrivacySettings;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "wantToWatch", label: "보고 싶은 공연", icon: HandMetal },
  { key: "viewingHistory", label: "관람 기록", icon: Ticket },
  { key: "favoriteClubs", label: "관심 클럽", icon: Star },
];

export default function PrivacyPage() {
  const { session, isLoading } = useRequireAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    wantToWatch: "public",
    viewingHistory: "public",
    favoriteClubs: "public",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleSettingChange = (key: keyof PrivacySettings, value: PrivacyLevel) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    // TODO: API 호출로 설정 저장
  };

  return (
    <UserPageLayout
      session={session}
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
          onChange={(value) => handleSettingChange(settingLabels[2].key, value)}
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
