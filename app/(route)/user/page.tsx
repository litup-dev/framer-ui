"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import UserMenus from "@/app/feature/user/components/menus";
import { getUserOptions } from "@/app/feature/user/query-options";
import FadeIn from "@/components/shared/fade-in";

const UserPage = () => {
  const { data: user } = useSuspenseQuery(getUserOptions());

  return (
    <FadeIn>
      <UserMenus user={user} />
    </FadeIn>
  );
};

export default UserPage;
