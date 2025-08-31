"use client";

import UserMenus from "@/app/feature/user/components/menus";
import FadeIn from "@/components/shared/fade-in";
import { useSession } from "next-auth/react";
import { User } from "@/app/feature/user/types";

const UserPage = () => {
  const user = useSession();

  return (
    <FadeIn>
      <UserMenus user={user.data?.user as User} />
    </FadeIn>
  );
};

export default UserPage;
