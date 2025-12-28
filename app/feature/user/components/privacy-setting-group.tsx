"use client";

import { Description, Title } from "@/components/shared/typography";
import { LucideIcon } from "lucide-react";

type PrivacyLevel = "public" | "friends" | "private";

interface PrivacyOption {
  value: PrivacyLevel;
  label: string;
}

interface PrivacySettingGroupProps {
  title: string;
  selectedValue: PrivacyLevel;
  onChange: (value: PrivacyLevel) => void;
  name: string;
  layout: "2xl" | "xl" | "lg" | "md" | "sm";
  icon?: LucideIcon;
}

const privacyOptions: PrivacyOption[] = [
  { value: "public", label: "전체 공개" },
  { value: "friends", label: "친구 공개" },
  { value: "private", label: "나만 보기" },
];

export default function PrivacySettingGroup({
  title,
  selectedValue,
  onChange,
  name,
  layout,
  icon: Icon,
}: PrivacySettingGroupProps) {
  // sm 레이아웃: 라디오 버튼이 텍스트 앞에 위치
  const isSmallLayout = layout === "sm";

  // 레이아웃별 클래스 설정
  const containerGap = layout === "md" ? "gap-6" : layout === "sm" ? "gap-4 py-6" : "gap-10";
  const optionsGap = layout === "md" || layout === "sm" ? "gap-3" : "gap-4";

  // lg: w-[412px], 2xl/xl: w-[378px], md: 너비 제한 없음, sm: 박스 스타일 없음
  const getLabelClass = () => {
    if (layout === "sm") {
      return "flex items-center gap-3 cursor-pointer";
    }
    if (layout === "md") {
      return "flex items-center justify-between h-[60px] p-5 border border-[#202020]/20 rounded cursor-pointer hover:border-[#202020]/30 transition-colors";
    }
    if (layout === "lg") {
      return "flex items-center justify-between w-[412px] h-[60px] px-6 py-5 border border-[#202020]/20 rounded cursor-pointer hover:border-[#202020]/30 transition-colors";
    }
    // 2xl, xl
    return "flex items-center justify-between w-[378px] h-[60px] px-6 py-5 border border-[#202020]/20 rounded cursor-pointer hover:border-[#202020]/30 transition-colors";
  };

  const radioButton = (optionValue: PrivacyLevel) => (
    <div className="relative flex items-center justify-center">
      <input
        type="radio"
        name={name}
        value={optionValue}
        checked={selectedValue === optionValue}
        onChange={() => onChange(optionValue)}
        className="sr-only"
      />
      <div className="w-5 h-5 rounded-full border border-[#202020]/20 flex items-center justify-center">
        {selectedValue === optionValue && (
          <div className="w-[10px] h-[10px] rounded-full bg-main" />
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col ${containerGap}`}>
      <div className="flex items-center gap-3 md:gap-2 lg:gap-3">
        {Icon && <Icon className="w-6 h-6 lg:w-8 lg:h-8" />}
        <Title className="font-semibold text-[14px] md:text-[20px] lg:text-[24px]">
          {title}
        </Title>
      </div>
      <div className={`flex flex-col ${optionsGap}`}>
        {privacyOptions.map((option) => (
          <label key={option.value} className={getLabelClass()}>
            {isSmallLayout && radioButton(option.value)}
            <Description className="text-[14px] md:text-[16px] lg:text-[18px]">
              {option.label}
            </Description>
            {!isSmallLayout && radioButton(option.value)}
          </label>
        ))}
      </div>
    </div>
  );
}
