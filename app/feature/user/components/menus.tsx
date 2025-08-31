import { User } from "@/app/feature/user/types";

import {
  ProfileSettings,
  NotificationSettings,
  PrivacySettings,
  AppSettings,
  AccountSettings,
} from "@/app/feature/user/components/settings";

const UserMenus = ({ user }: { user: User }) => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">설정</h2>
        <ProfileSettings user={user} />
        <NotificationSettings />
        <PrivacySettings />
        <AppSettings />
        <AccountSettings />
      </div>
    </div>
  );
};

export default UserMenus;
