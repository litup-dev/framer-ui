import { PropsWithChildren, Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getServerQueryClient } from "@/lib/query-client";
import { getUserOptions } from "@/app/feature/user/query-options";

const UserLayout = async ({ children }: PropsWithChildren) => {
  const queryClient = getServerQueryClient();
  await queryClient.prefetchQuery(getUserOptions());

  const prefetchData = dehydrate(queryClient);

  return (
    <HydrationBoundary state={prefetchData}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </HydrationBoundary>
  );
};

export default UserLayout;
