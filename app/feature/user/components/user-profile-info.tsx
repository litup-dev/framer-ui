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
  isExpanded: boolean;
  onToggleExpand: () => void;
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
  isExpanded,
  onToggleExpand,
}: UserProfileInfoProps) {
  const [showMoreButton, setShowMoreButton] = useState(false);

  useEffect(() => {
    if (!isEditing && bio) {
      // 줄바꿈 개수로 더보기 버튼 표시 여부 결정
      const lineCount = (bio.match(/\n/g) || []).length + 1;
      setShowMoreButton(lineCount > 3);
    } else if (!isEditing && !bio) {
      // bio가 없으면 더보기 버튼 숨김
      setShowMoreButton(false);
    }
  }, [bio, isEditing]);

  if (isEditing) {
    return (
      <>
        <Input
          type="text"
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          className={`${inputHeight} text-lg font-bold w-full md:w-[400px] lg:w-[480px] xl:w-full leading-[160%] tracking-[-0.04em]`}
          style={{ letterSpacing: '-0.04em', lineHeight: '160%' }}
          maxLength={23}
        />
        <Textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="자기소개를 입력하세요"
          className={`${textareaHeight} text-sm resize-none mt-1 w-full md:w-[400px] lg:w-[480px] xl:w-full leading-[160%] tracking-[-0.04em]`}
          style={{ letterSpacing: '-0.04em', lineHeight: '160%' }}
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
          <Description
            className={`${bioClass} whitespace-pre-wrap ${
              !isExpanded && showMoreButton ? "line-clamp-3" : ""
            }`}
          >
            {bio}
          </Description>
          {showMoreButton && (
            <div className="mt-2">
              <button
                onClick={onToggleExpand}
                className="text-sm text-black-40 hover:opacity-70 text-left"
              >
                {isExpanded ? "접기" : "더보기"}
              </button>
            </div>
          )}
        </>
      ) : (
        <Description className={bioClass}>자기소개가 없습니다.</Description>
      )}
    </>
  );
}
