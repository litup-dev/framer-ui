import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

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
  const [showEditButton, setShowEditButton] = useState(false);

  if (isEditing) {
    return (
      <div className="relative">
        <button
          onClick={onSave}
          className="text-sm font-medium text-black hover:text-black/70"
        >
          확인
        </button>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowEditButton(!showEditButton)}
          className="p-1 hover:bg-accent rounded-full"
        >
          <Ellipsis className="w-5 h-5" />
        </button>

        {showEditButton && (
          <button
            onClick={() => {
              onEdit();
              setShowEditButton(false);
            }}
            className={editButtonClass}
          >
            수정하기
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-accent rounded-full">
            <Ellipsis className="w-5 h-5" />
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
