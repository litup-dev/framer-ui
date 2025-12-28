import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

interface UserProfileAvatarProps {
  profilePath?: string | null;
  nickname: string;
  isEditing: boolean;
  sizeClass: string;
  textSizeClass: string;
}

export default function UserProfileAvatar({
  profilePath,
  nickname,
  isEditing,
  sizeClass,
  textSizeClass,
}: UserProfileAvatarProps) {
  return (
    <div className="relative flex-shrink-0">
      <Avatar className={sizeClass}>
        <AvatarImage
          src={getImageUrl(profilePath) || ""}
          alt={nickname}
        />
        <AvatarFallback className={`bg-muted text-black ${textSizeClass}`}>
          {nickname?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      {isEditing && (
        <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border">
          <Camera className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
