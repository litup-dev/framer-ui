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
  if (isEditing) {
    return (
      <>
        <Input
          type="text"
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          className={`${inputHeight} text-lg font-bold`}
        />
        <Textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="자기소개를 입력하세요"
          className={`${textareaHeight} text-sm resize-none mt-1`}
        />
      </>
    );
  }

  return (
    <>
      <Title className={nicknameClass}>{nickname}</Title>
      <Description className={bioClass}>
        {bio || "자기소개가 없습니다."}
      </Description>
    </>
  );
}
