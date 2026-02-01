import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Title, Description } from "@/components/shared/typography";

interface UserProfileInfoProps {
  nickname: string;
  bio: string;
  isEditing: boolean;
  onNicknameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  nicknameClass: string;
  bioClass: string;
  inputHeight: string;
  textareaHeight: string;
}

export default function UserProfileInfo({
  nickname,
  bio,
  isEditing,
  onNicknameChange,
  onBioChange,
  nicknameClass,
  bioClass,
  inputHeight,
  textareaHeight,
}: UserProfileInfoProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isEditing && bio) {
      // 줄바꿈 개수로 더보기 버튼 표시 여부 결정
      const lineCount = (bio.match(/\n/g) || []).length + 1;
      setShowMoreButton(lineCount > 3);

      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.overflow = "visible";
        const fullHeight = textarea.scrollHeight;

        if (isExpanded) {
          textarea.style.height = `${fullHeight}px`;
          textarea.style.overflow = "visible";
        } else {
          const computedStyle = getComputedStyle(textarea);
          const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
          const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
          const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
          const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
          const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

          const threeLineHeight =
            lineHeight * 3 +
            paddingTop +
            paddingBottom +
            borderTop +
            borderBottom;

          textarea.style.height = `${threeLineHeight}px`;
          textarea.style.overflow = "hidden";
        }
      }
    } else if (!isEditing && !bio) {
      // bio가 없으면 더보기 버튼 숨김
      setShowMoreButton(false);
    }
  }, [bio, isExpanded, isEditing]);

  // 편집 모드를 빠져나올 때 isExpanded 초기화
  useEffect(() => {
    if (isEditing) {
      setIsExpanded(false);
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <>
        <Input
          type="text"
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          className={`${inputHeight} text-lg font-bold w-full md:w-[400px] lg:w-[480px] xl:w-full`}
          maxLength={23}
        />
        <Textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="자기소개를 입력하세요"
          className={`${textareaHeight} text-sm resize-none mt-1 w-full md:w-[400px] lg:w-[480px] xl:w-full`}
          maxLength={255}
        />
      </>
    );
  }

  return (
    <>
      <Title className={nicknameClass}>{nickname}</Title>
      {bio ? (
        <>
          <Textarea
            ref={textareaRef}
            className={`${bioClass} border-none shadow-none resize-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 whitespace-pre-wrap`}
            value={bio}
            readOnly
          />
          {showMoreButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-black-40 hover:opacity-70 mt-2 text-left"
            >
              {isExpanded ? "접기" : "더보기"}
            </button>
          )}
        </>
      ) : (
        <Description className={bioClass}>자기소개가 없습니다.</Description>
      )}
    </>
  );
}
