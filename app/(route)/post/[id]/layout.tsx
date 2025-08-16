import { ErrorBoundary, Suspense } from "@suspensive/react";
import { PropsWithChildren } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getPostsByIdOptions } from "@/app/feature/home/query-options";
import { getServerQueryClient } from "@/lib/query-client";

const PostLayout = async ({
  params,
  children,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) => {
  const queryClient = getServerQueryClient();
  const { id } = await params;
  await queryClient.prefetchQuery(getPostsByIdOptions(id));
  const prefetchData = dehydrate(queryClient);

  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <HydrationBoundary state={prefetchData}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </HydrationBoundary>
    </ErrorBoundary>
  );
};

export default PostLayout;
