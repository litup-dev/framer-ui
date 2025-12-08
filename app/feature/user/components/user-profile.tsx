"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/shared/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Camera } from "lucide-react";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

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
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [bio, setBio] = useState("");
  const [nickname, setNickname] = useState(session.nickname);
  const [isFollowing, setIsFollowing] = useState(false);

  // props로 받은 isEditing을 사용하거나, 내부 state 사용
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;

  const handleSave = () => {
    // TODO: API 호출로 저장
    setIsEditing(false);
  };

  const handleFollow = () => {
    // TODO: API 호출로 팔로우/언팔로우 처리
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex flex-col">
      {/* 프로필 이미지와 ... 버튼 */}
      <div className="flex items-start justify-between">
        {/* xl 이상: 아바타만, lg 이하: 아바타 + 닉네임/자기소개 가로 배치 */}
        <div className="flex gap-4 lg:gap-6 xl:gap-0 xl:flex-col">
          <div className="relative flex-shrink-0">
            <Avatar className="w-20 h-20 md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]">
              <AvatarImage
                src={getImageUrl(session.profilePath) || ""}
                alt={nickname}
              />
              <AvatarFallback className="bg-muted text-black text-xl md:text-2xl lg:text-3xl">
                {nickname?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* lg 이하에서만 표시: 닉네임 + 자기소개 (아바타 옆) */}
          <div className="xl:hidden flex flex-col justify-center flex-1">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full h-12 px-3 text-lg font-bold border border-[#202020]/10 rounded focus:outline-none focus:border-ring"
                />
                {/* 자기소개 - 편집 모드일 때 간격 4px */}
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="자기소개를 입력하세요"
                  className="w-full h-[100px] p-3 border border-[#202020]/10 rounded text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring mt-1"
                />
              </>
            ) : (
              <>
                <Chip className="font-bold text-black text-lg">{nickname}</Chip>
                {/* 자기소개 - 일반 모드일 때 간격: lg 16px, md 10px, sm 16px */}
                <p className="text-sm text-muted-foreground mt-4 md:mt-[10px] lg:mt-4">
                  {bio || "자기소개가 없습니다."}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ... 버튼 또는 확인 텍스트 */}
        <div className="relative">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-sm font-medium text-black hover:text-black/70"
            >
              확인
            </button>
          ) : isOwner ? (
            <>
              <button
                onClick={() => setShowEditButton(!showEditButton)}
                className="p-1 hover:bg-accent rounded-full"
              >
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 bg-current rounded-full" />
                  <span className="w-1 h-1 bg-current rounded-full" />
                  <span className="w-1 h-1 bg-current rounded-full" />
                </div>
              </button>

              {showEditButton && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowEditButton(false);
                  }}
                  className="absolute right-full mr-2 top-0 md:top-full md:right-0 md:left-auto md:mt-2 md:mr-0 w-[81px] h-[46px] xl:w-24 xl:h-14 2xl:w-24 2xl:h-14 flex items-center justify-center border border-[#202020]/10 rounded bg-white hover:bg-accent/50 transition-colors text-sm font-medium shadow-sm z-10"
                >
                  수정하기
                </button>
              )}
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-accent rounded-full">
                  <div className="flex gap-0.5">
                    <span className="w-1 h-1 bg-current rounded-full" />
                    <span className="w-1 h-1 bg-current rounded-full" />
                    <span className="w-1 h-1 bg-current rounded-full" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>신고하기</DropdownMenuItem>
                <DropdownMenuItem>차단하기</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* xl 이상에서만 표시: 닉네임 + 자기소개 (아바타 하단) - 간격: xl/2xl 32px */}
      <div className="hidden xl:flex flex-col mt-8">
        {isEditing ? (
          <>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-12 px-3 text-lg font-bold border border-[#202020]/10 rounded focus:outline-none focus:border-ring"
            />
            {/* 자기소개 - 편집 모드일 때 간격 4px */}
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요"
              className="w-full h-[100px] p-3 border border-[#202020]/10 rounded text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring mt-1"
            />
          </>
        ) : (
          <>
            <Chip className="font-bold text-black text-lg">{nickname}</Chip>
            {/* 자기소개 - 일반 모드일 때 간격: xl/2xl 24px */}
            <p className="text-sm text-muted-foreground mt-6">
              {bio || "자기소개가 없습니다."}
            </p>
          </>
        )}
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
