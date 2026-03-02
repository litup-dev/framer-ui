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
  actionButton?: React.ReactNode;
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
  actionButton,
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
        <div className="flex items-center gap-1 md:gap-2 -mt-[2px] -ml-[4px] md:-mt-0">
          <Input
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] 2xl:text-[24px] font-bold w-[257px] md:w-[400px] lg:w-[480px] xl:w-[345px] 2xl:w-[378px] h-[28px] md:h-[30px] lg:h-[36px] xl:h-[48px] 2xl:h-[48px] leading-[160%] tracking-[-0.04em] px-[5px] md:px-[6px] lg:px-2 xl:px-3 2xl:px-3 py-0 xl:-ml-3 2xl:-ml-3"
            style={{ letterSpacing: '-0.04em', lineHeight: '160%' }}
            maxLength={23}
          />
          {actionButton}
        </div>
        <Textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="자기소개를 입력하세요"
          className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] font-medium resize-none mt-0.5 md:mt-1 lg:mt-1 xl:mt-1 2xl:mt-1 w-[257px] md:w-[400px] lg:w-[480px] xl:w-[345px] 2xl:w-[378px] h-[64px] md:h-[70px] lg:h-[86px] xl:h-[100px] 2xl:h-[100px] leading-[160%] tracking-[-0.04em] px-[5px] md:px-[6px] lg:px-2 xl:px-3 2xl:px-3 pt-0 md:pt-0.5 lg:pt-1 xl:pt-2 2xl:pt-[6px] pb-0 md:pb-0.5 lg:pb-1 xl:pb-2 2xl:pb-2 -ml-[4px] xl:-ml-3 2xl:-ml-3"
          style={{ letterSpacing: '-0.04em', lineHeight: '160%' }}
          maxLength={255}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 h-4 md:h-auto">
        <Title className={`${nicknameClass} border border-transparent px-[1px] md:px-[6px] lg:px-2 xl:px-0 2xl:px-0 pt-[5px] md:pt-[5px] lg:pt-2 xl:pt-0 2xl:pt-0 pb-0 leading-none md:leading-normal`}>{nickname}</Title>
        {actionButton}
      </div>
      {bio ? (
        <>
          <Description
            className={`${bioClass} whitespace-pre-wrap leading-[160%] border border-transparent px-[1px] md:px-[6px] lg:px-2 xl:px-0 2xl:px-0 pt-0 pb-0 md:pb-0.5 lg:pb-1 xl:pb-2 2xl:pb-2 mt-3 md:h-auto overflow-hidden ${
              !isExpanded && showMoreButton ? "line-clamp-3 h-[38px]" : "h-auto"
            }`}
          >
            {bio}
          </Description>
          {showMoreButton && (
            <button
              onClick={onToggleExpand}
              className="text-[16px] font-medium text-black-40 hover:opacity-70 text-left tracking-[-0.04em] leading-[160%] mt-2"
            >
              {isExpanded ? "접기" : "더보기"}
            </button>
          )}
        </>
      ) : (
        <Description className={`${bioClass} border border-transparent px-[2px] md:px-[6px] lg:px-2 xl:px-0 2xl:px-0 pt-0 pb-0 md:pb-0.5 lg:pb-1 xl:pb-2 2xl:pb-2 tracking-[-0.04em] mt-3 h-[38px] md:h-auto overflow-hidden`}>자기소개가 없습니다.</Description>
      )}
    </>
  );
}
