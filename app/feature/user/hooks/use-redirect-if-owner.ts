"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";

// 다른 유저 페이지(/user/[publicId]/...)에서 본인이 로그인했거나
// 본인 publicId로 직접 진입한 경우 본인 마이페이지 경로로 교체한다.
export function useRedirectIfOwner(viewingPublicId: string | null) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!viewingPublicId || !user?.publicId) return;
    if (user.publicId !== viewingPublicId) return;

    const ownerPath = pathname.replace(
      `/user/${viewingPublicId}`,
      "/user",
    );
    router.replace(ownerPath);
  }, [user?.publicId, viewingPublicId, pathname, router]);
}
