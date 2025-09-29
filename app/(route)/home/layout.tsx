import { PropsWithChildren } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getPostsOptions } from "@/app/feature/home/query-options";
import { getServerQueryClient } from "@/lib/query-client";

const Layout = async ({ children }: PropsWithChildren) => {
  const queryClient = getServerQueryClient();
  await queryClient.prefetchQuery(getPostsOptions());
  const prefetchData = dehydrate(queryClient);

  return <HydrationBoundary state={prefetchData}>{children}</HydrationBoundary>;
};

export default Layout;
