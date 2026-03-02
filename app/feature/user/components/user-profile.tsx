"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import UserProfileAvatar from "./user-profile-avatar";
import UserProfileInfo from "./user-profile-info";
import UserProfileActions from "./user-profile-actions";
import ProfileImageCropModal from "./profile-image-crop-modal";
import { updateUserInfo, getUserInfo } from "@/app/feature/user/query-options";
import { apiClient } from "@/lib/api-client";
import { UserInfo, useUserStore } from "@/store/user-store";
import { userProfileSchema } from "@/app/feature/user/validation/user-profile";
import { useCommonModalStore } from "@/store/common-modal-store";

interface UserProfileProps {
  user: UserInfo | null;
  isOwner: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  isBioExpanded?: boolean;
  setIsBioExpanded?: (value: boolean) => void;
}

export default function UserProfile({
  user,
  isOwner,
  isEditing: externalIsEditing,
  setIsEditing: externalSetIsEditing,
  isBioExpanded: externalIsBioExpanded,
  setIsBioExpanded: externalSetIsBioExpanded,
}: UserProfileProps) {
  const { setUser } = useUserStore();
  const { openModal } = useCommonModalStore();
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    user?.profilePath || null
  );
  const [tempProfileImage, setTempProfileImage] = useState<Blob | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [internalIsBioExpanded, setInternalIsBioExpanded] = useState(false);

  // 원본 데이터 저장 (변경 감지용)
  const [originalBio] = useState(user?.bio || "");
  const [originalNickname] = useState(user?.nickname || "");

  // props로 받은 isEditing을 사용하거나, 내부 state 사용
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;

  // props로 받은 isBioExpanded를 사용하거나, 내부 state 사용
  const isBioExpanded =
    externalIsBioExpanded !== undefined ? externalIsBioExpanded : internalIsBioExpanded;
  const setIsBioExpanded = externalSetIsBioExpanded || setInternalIsBioExpanded;

  // 유저 프로필 수정 mutation (닉네임/bio만)
  const updateMutation = useMutation({
    mutationFn: async (params: { nickname: string; bio: string }) => {
      return updateUserInfo(params);
    },
    onSuccess: async (response: any) => {
      // API 응답에서 최신 유저 정보 받기 (id, nickname, profilePath, bio)
      const updatedUserInfo = response.data;

      // user store 업데이트
      setUser(updatedUserInfo);

      setProfileImageUrl(updatedUserInfo.profilePath);
      setTempProfileImage(null);
      setPreviewImageUrl(null);
      setIsEditing(false);
    },
    onError: (error: any) => {
      openModal({
        description: error?.message || "프로필 수정에 실패했습니다.",
        confirmButton: {
          label: "확인",
          onClick: () => {},
        },
      });
    },
  });

  const handleSave = async () => {
    // Validation
    const validationResult = userProfileSchema.safeParse({ nickname, bio });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      openModal({
        description: firstError?.message || "입력값이 올바르지 않습니다.",
        confirmButton: {
          label: "확인",
          onClick: () => {},
        },
      });
      return;
    }

    // 변경 여부 확인
    const isNicknameChanged = nickname !== originalNickname;
    const isBioChanged = bio !== originalBio;
    const isProfileImageChanged = tempProfileImage !== null;

    // 아무것도 변경되지 않았으면 편집 모드만 종료
    if (!isNicknameChanged && !isBioChanged && !isProfileImageChanged) {
      setIsEditing(false);
      return;
    }

    try {
      // 1. 프로필 이미지가 변경되었으면 먼저 업로드
      if (isProfileImageChanged && tempProfileImage) {
        const formData = new FormData();
        formData.append("image", tempProfileImage, "profile.jpg");

        await apiClient.post("/api/v1/upload/avatar", formData);

        setTempProfileImage(null);
        setPreviewImageUrl(null);
      }

      // 2. 닉네임/bio가 변경되었으면 업데이트
      if (isNicknameChanged || isBioChanged) {
        updateMutation.mutate({
          nickname,
          bio,
        });
      } else if (isProfileImageChanged) {
        // 프로필 이미지만 변경된 경우 - 최신 유저 정보 조회
        if (user?.publicId) {
          const userInfoResponse = await getUserInfo(user.publicId);
          setUser(userInfoResponse.data);
          setProfileImageUrl(userInfoResponse.data.profilePath);
        }
        setIsEditing(false);
      }
    } catch (error) {
      openModal({
        description: "프로필 사진 업로드에 실패했습니다.",
        confirmButton: {
          label: "확인",
          onClick: () => {},
        },
      });
    }
  };

  const handleFollow = () => {
    // TODO: API 호출로 팔로우/언팔로우 처리
    setIsFollowing(!isFollowing);
  };

  const handleProfileImageSelect = (croppedImageBlob: Blob) => {
    // 임시 저장 및 미리보기
    setTempProfileImage(croppedImageBlob);
    const previewUrl = URL.createObjectURL(croppedImageBlob);
    setPreviewImageUrl(previewUrl);
  };

  return (
    <div className="flex flex-col">
      {/* 프로필 이미지 편집 모달 */}
      <ProfileImageCropModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSave={handleProfileImageSelect}
        existingImageUrl={profileImageUrl}
      />

      {/* xl 이상: 아바타 + 버튼 (우측 상단) */}
      <div className="hidden xl:flex items-start justify-between">
        <UserProfileAvatar
          profilePath={previewImageUrl || profileImageUrl}
          nickname={nickname}
          isEditing={isEditing}
          sizeClass="w-[120px] h-[120px]"
          textSizeClass="text-3xl"
          onEditClick={() => setIsImageModalOpen(true)}
        />
        {(isOwner && isEditing) || !isOwner ? (
          <UserProfileActions
            isOwner={isOwner}
            isEditing={isEditing}
            onSave={handleSave}
            onEdit={() => setIsEditing(true)}
            editButtonClass=""
          />
        ) : null}
      </div>

      {/* xl 이상: 닉네임 + profile-edit 버튼 + 자기소개 */}
      <div className={`hidden xl:block ${isEditing ? 'xl:mt-[23px] 2xl:mt-[23px]' : 'xl:mt-8 2xl:mt-8'}`}>
        <UserProfileInfo
          nickname={nickname}
          bio={bio}
          isEditing={isEditing}
          onNicknameChange={setNickname}
          onBioChange={setBio}
          nicknameClass="text-[24px]"
          bioClass="text-[16px] text-muted-foreground xl:mt-6 2xl:mt-[19px]"
          inputHeight="h-12"
          textareaHeight="h-[100px]"
          isExpanded={isBioExpanded}
          onToggleExpand={() => setIsBioExpanded(!isBioExpanded)}
          actionButton={
            isOwner && !isEditing ? (
              <UserProfileActions
                isOwner={isOwner}
                isEditing={isEditing}
                onSave={handleSave}
                onEdit={() => setIsEditing(true)}
                editButtonClass=""
              />
            ) : null
          }
        />
      </div>

      {/* md, lg: 아바타 + 닉네임/자기소개 + 버튼 (우측 상단) */}
      <div className="hidden md:flex xl:hidden items-start justify-between">
        <div className="flex gap-4 lg:gap-6 flex-1">
          <UserProfileAvatar
            profilePath={previewImageUrl || profileImageUrl}
            nickname={nickname}
            isEditing={isEditing}
            sizeClass="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]"
            textSizeClass="text-2xl lg:text-3xl"
            onEditClick={() => setIsImageModalOpen(true)}
          />

          {/* 닉네임 + profile-edit 버튼 + 자기소개 (아바타 옆) */}
          <div className="flex flex-col justify-center flex-1">
            <UserProfileInfo
              nickname={nickname}
              bio={bio}
              isEditing={isEditing}
              onNicknameChange={setNickname}
              onBioChange={setBio}
              nicknameClass="text-[18px] lg:text-[20px]"
              bioClass="text-[14px] lg:text-[16px] text-muted-foreground mt-[10px] lg:mt-[14px]"
              inputHeight="h-12"
              textareaHeight="h-[100px]"
              isExpanded={isBioExpanded}
              onToggleExpand={() => setIsBioExpanded(!isBioExpanded)}
              actionButton={
                isOwner && !isEditing ? (
                  <UserProfileActions
                    isOwner={isOwner}
                    isEditing={isEditing}
                    onSave={handleSave}
                    onEdit={() => setIsEditing(true)}
                    editButtonClass=""
                  />
                ) : null
              }
            />
          </div>
        </div>

        {(isOwner && isEditing) || !isOwner ? (
          <UserProfileActions
            isOwner={isOwner}
            isEditing={isEditing}
            onSave={handleSave}
            onEdit={() => setIsEditing(true)}
            editButtonClass=""
          />
        ) : null}
      </div>

      {/* sm (모바일): 버튼 (상단 우측) */}
      <div className="md:hidden">
        <div className="flex justify-end h-[14px] mb-[26px]">
          {(isOwner && isEditing) || !isOwner ? (
            <UserProfileActions
              isOwner={isOwner}
              isEditing={isEditing}
              onSave={handleSave}
              onEdit={() => setIsEditing(true)}
              editButtonClass=""
            />
          ) : null}
        </div>

        {/* 아바타 + 닉네임/자기소개 */}
        <div className="flex gap-3.5">
          <UserProfileAvatar
            profilePath={previewImageUrl || profileImageUrl}
            nickname={nickname}
            isEditing={isEditing}
            sizeClass="w-20 h-20"
            textSizeClass="text-xl"
            onEditClick={() => setIsImageModalOpen(true)}
          />

          {/* 닉네임 + profile-edit 버튼 + 자기소개 (아바타 옆) */}
          <div className="flex flex-col flex-1 pt-[5px] md:pt-[7px] pb-[7px]">
            <UserProfileInfo
              nickname={nickname}
              bio={bio}
              isEditing={isEditing}
              onNicknameChange={setNickname}
              onBioChange={setBio}
              nicknameClass="text-[16px]"
              bioClass="text-[12px] text-muted-foreground mt-3"
              inputHeight="h-7"
              textareaHeight="h-16"
              isExpanded={isBioExpanded}
              onToggleExpand={() => setIsBioExpanded(!isBioExpanded)}
              actionButton={
                isOwner && !isEditing ? (
                  <UserProfileActions
                    isOwner={isOwner}
                    isEditing={isEditing}
                    onSave={handleSave}
                    onEdit={() => setIsEditing(true)}
                    editButtonClass=""
                  />
                ) : null
              }
            />
          </div>
        </div>
      </div>

      {/* 팔로우 버튼 (다른 유저일 때만) - MVP에서는 미지원 */}
      {/* {!isOwner && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleFollow}
          className="mt-6"
        >
          {isFollowing ? "팔로우 중" : "팔로우하기 +"}
        </Button>
      )} */}
    </div>
  );
}
