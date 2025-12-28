"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import UserProfileAvatar from "./user-profile-avatar";
import UserProfileInfo from "./user-profile-info";
import UserProfileActions from "./user-profile-actions";
import { updateUserInfo, getUserInfo } from "@/app/feature/user/query-options";

interface UserProfileProps {
  session: Session;
  isOwner: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

export default function UserProfile({
  session,
  isOwner,
  isEditing: externalIsEditing,
  setIsEditing: externalSetIsEditing,
}: UserProfileProps) {
  const { update } = useSession();
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [bio, setBio] = useState(session.bio || "");
  const [nickname, setNickname] = useState(session.nickname || "");
  const [isFollowing, setIsFollowing] = useState(false);

  // props로 받은 isEditing을 사용하거나, 내부 state 사용
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;

  // 유저 프로필 수정 mutation
  const updateMutation = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: async () => {
      // API로 최신 유저 정보 조회
      if (session.userId) {
        const userInfoResponse = await getUserInfo(session.userId);
        const updatedUserInfo = userInfoResponse.data;

        // session 업데이트 - 변경된 필드만 전달
        await update({
          nickname: updatedUserInfo.nickname,
          bio: updatedUserInfo.bio,
          profilePath: updatedUserInfo.profilePath,
        });
      }
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      nickname,
      bio,
    });
  };

  const handleFollow = () => {
    // TODO: API 호출로 팔로우/언팔로우 처리
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex flex-col">
      {/* xl 이상: 아바타 + ... 버튼 */}
      <div className="hidden xl:flex items-start justify-between">
        <UserProfileAvatar
          profilePath={session.profilePath}
          nickname={nickname}
          isEditing={isEditing}
          sizeClass="w-[120px] h-[120px]"
          textSizeClass="text-3xl"
        />
        <UserProfileActions
          isOwner={isOwner}
          isEditing={isEditing}
          onSave={handleSave}
          onEdit={() => setIsEditing(true)}
          editButtonClass="absolute right-full mr-2 top-0 md:top-full md:right-0 md:left-auto md:mt-2 md:mr-0 w-24 h-14 flex items-center justify-center border border-[#202020]/10 rounded bg-white hover:bg-accent/50 transition-colors text-sm font-medium shadow-sm z-10"
        />
      </div>

      {/* xl 이상: 닉네임 + 자기소개 (아바타 하단, 확인 버튼 영역까지 전체 너비) */}
      <div className="hidden xl:flex flex-col mt-8">
        <UserProfileInfo
          nickname={nickname}
          bio={bio}
          isEditing={isEditing}
          onNicknameChange={setNickname}
          onBioChange={setBio}
          nicknameClass="text-[24px]"
          bioClass="text-[16px] text-muted-foreground mt-6"
          inputHeight="h-12"
          textareaHeight="h-[100px]"
        />
      </div>

      {/* md, lg: 아바타 + 닉네임/자기소개 + 확인 버튼 */}
      <div className="hidden md:flex xl:hidden items-start justify-between">
        <div className="flex gap-4 lg:gap-6 flex-1">
          <UserProfileAvatar
            profilePath={session.profilePath}
            nickname={nickname}
            isEditing={isEditing}
            sizeClass="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]"
            textSizeClass="text-2xl lg:text-3xl"
          />

          {/* 닉네임 + 자기소개 (아바타 옆) */}
          <div className="flex flex-col justify-center flex-1">
            <UserProfileInfo
              nickname={nickname}
              bio={bio}
              isEditing={isEditing}
              onNicknameChange={setNickname}
              onBioChange={setBio}
              nicknameClass="text-[18px] lg:text-[20px]"
              bioClass="text-[14px] lg:text-[16px] text-muted-foreground mt-[10px] lg:mt-4"
              inputHeight="h-12"
              textareaHeight="h-[100px]"
            />
          </div>
        </div>

        <UserProfileActions
          isOwner={isOwner}
          isEditing={isEditing}
          onSave={handleSave}
          onEdit={() => setIsEditing(true)}
          editButtonClass="absolute top-full right-0 mt-2 w-[81px] h-[46px] flex items-center justify-center border border-[#202020]/10 rounded bg-white hover:bg-accent/50 transition-colors text-sm font-medium shadow-sm z-10"
        />
      </div>

      {/* sm (모바일): 확인 버튼이 닉네임보다 상단 */}
      <div className="md:hidden">
        <div className="flex justify-end mb-2">
          <UserProfileActions
            isOwner={isOwner}
            isEditing={isEditing}
            onSave={handleSave}
            onEdit={() => setIsEditing(true)}
            editButtonClass="absolute right-full mr-2 top-0 w-[81px] h-[46px] flex items-center justify-center border border-[#202020]/10 rounded bg-white hover:bg-accent/50 transition-colors text-sm font-medium shadow-sm z-10"
          />
        </div>

        {/* 아바타 + 닉네임/자기소개 */}
        <div className="flex gap-4">
          <UserProfileAvatar
            profilePath={session.profilePath}
            nickname={nickname}
            isEditing={isEditing}
            sizeClass="w-20 h-20"
            textSizeClass="text-xl"
          />

          {/* 닉네임 + 자기소개 (아바타 옆) */}
          <div className="flex flex-col justify-center flex-1">
            <UserProfileInfo
              nickname={nickname}
              bio={bio}
              isEditing={isEditing}
              onNicknameChange={setNickname}
              onBioChange={setBio}
              nicknameClass="text-[16px]"
              bioClass="text-[12px] text-muted-foreground mt-4"
              inputHeight="h-7"
              textareaHeight="h-16"
            />
          </div>
        </div>
      </div>

      {/* 팔로우 버튼 (다른 유저일 때만) */}
      {!isOwner && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleFollow}
          className="mt-6"
        >
          {isFollowing ? "팔로우 중" : "팔로우하기 +"}
        </Button>
      )}
    </div>
  );
}
