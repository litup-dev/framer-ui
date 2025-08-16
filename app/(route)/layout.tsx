import { PropsWithChildren } from "react";

import BottomNavigation from "@/app/shared/bottom-navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getDomainOptions } from "@/app/feature/home/query-options";

const Layout = async ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient();
  const domainOptions = getDomainOptions();
  await queryClient.prefetchQuery(domainOptions);
  const prefetchData = dehydrate(queryClient);

  return (
    <div className="max-w-xl m-auto">
      <HydrationBoundary state={prefetchData}>{children}</HydrationBoundary>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
