import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileActionsProps {
  isOwner: boolean;
  isEditing: boolean;
  onSave: () => void;
  onEdit: () => void;
  editButtonClass: string;
}

export default function UserProfileActions({
  isOwner,
  isEditing,
  onSave,
  onEdit,
  editButtonClass,
}: UserProfileActionsProps) {
  if (isEditing) {
    return (
      <div className="relative">
        <button
          onClick={onSave}
          className="text-[14px] md:text-[16px] 2xl:text-[20px] font-bold text-black hover:text-black/70 tracking-[-0.04em]"
        >
          완료
        </button>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="relative">
        <button
          onClick={onEdit}
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <Image
            src="/images/user/profile-edit.svg"
            alt="프로필 수정"
            width={32}
            height={32}
            className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-[30px] 2xl:h-[30px]"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="relative hidden xl:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
            <Image
              src="/images/user/ellipsis_gray.svg"
              alt="메뉴"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>신고하기</DropdownMenuItem>
          {/* MVP에서는 미지원 */}
          {/* <DropdownMenuItem>차단하기</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
