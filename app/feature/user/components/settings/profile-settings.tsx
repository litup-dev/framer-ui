import { User } from "@/app/feature/user/types";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfileSettings = ({ user }: { user: User }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          {user.image && <AvatarImage src={user.image} alt="프로필 사진" />}
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-gray-700 font-medium">닉네임</span>
          {user?.name && (
            <span className="text-sm text-gray-500">{user.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
