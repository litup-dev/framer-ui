import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

interface UserProfileAvatarProps {
  profilePath?: string | null;
  nickname: string;
  isEditing: boolean;
  sizeClass: string;
  textSizeClass: string;
  onEditClick?: () => void;
}

export default function UserProfileAvatar({
  profilePath,
  nickname,
  isEditing,
  sizeClass,
  textSizeClass,
  onEditClick,
}: UserProfileAvatarProps) {
  const handleClick = () => {
    if (isEditing && onEditClick) {
      onEditClick();
    }
  };

  return (
    <div className="relative flex-shrink-0">
      <div
        onClick={handleClick}
        className={isEditing ? "cursor-pointer" : ""}
      >
        <Avatar className={sizeClass}>
          <AvatarImage
            src={getImageUrl(profilePath) || ""}
            alt={nickname}
          />
          <AvatarFallback className={`bg-muted text-black ${textSizeClass}`}>
            {nickname?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      {isEditing && (
        <button
          onClick={handleClick}
          className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border hover:bg-gray-50 transition-colors"
        >
          <Camera className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
