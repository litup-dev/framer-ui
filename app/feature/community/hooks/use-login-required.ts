"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCommonModalStore } from "@/store/common-modal-store";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { saveReturnUrl } from "@/lib/login-utils";

export function useLoginRequired() {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useCommonModalStore();
  const { isAuthenticated } = useCurrentUser();

  const showLoginModal = (): void => {
    openModal({
      description:
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
      confirmButton: {
        label: "확인",
        onClick: () => {
          saveReturnUrl(pathname);
          router.push("/login");
        },
      },
      cancelButton: {
        label: "취소",
        onClick: () => {},
      },
    });
  };

  return {
    isAuthenticated,
    showLoginModal,
  };
}
