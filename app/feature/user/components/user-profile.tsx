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
}

export default function UserProfile({
  user,
  isOwner,
  isEditing: externalIsEditing,
  setIsEditing: externalSetIsEditing,
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

  // 원본 데이터 저장 (변경 감지용)
  const [originalBio] = useState(user?.bio || "");
  const [originalNickname] = useState(user?.nickname || "");

  // props로 받은 isEditing을 사용하거나, 내부 state 사용
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;

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

      {/* xl 이상: 아바타 + ... 버튼 */}
      <div className="hidden xl:flex items-start justify-between">
        <UserProfileAvatar
          profilePath={previewImageUrl || profileImageUrl}
          nickname={nickname}
          isEditing={isEditing}
          sizeClass="w-[120px] h-[120px]"
          textSizeClass="text-3xl"
          onEditClick={() => setIsImageModalOpen(true)}
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
            profilePath={previewImageUrl || profileImageUrl}
            nickname={nickname}
            isEditing={isEditing}
            sizeClass="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]"
            textSizeClass="text-2xl lg:text-3xl"
            onEditClick={() => setIsImageModalOpen(true)}
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
            profilePath={previewImageUrl || profileImageUrl}
            nickname={nickname}
            isEditing={isEditing}
            sizeClass="w-20 h-20"
            textSizeClass="text-xl"
            onEditClick={() => setIsImageModalOpen(true)}
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
