"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useLoginRequired } from "../hooks/use-login-required";

export function CommunityWriteFab() {
  const router = useRouter();
  const { isAuthenticated, showLoginModal } = useLoginRequired();

  const handleClick = () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    router.push("/community/write");
  };

  return (
    <button
      onClick={handleClick}
      className="md:hidden fixed bottom-6 right-5 z-50 w-16 h-16 rounded-full bg-main text-white flex items-center justify-center shadow-[0_4px_20px_0_rgba(0,0,0,0.2)] active:scale-95 transition-transform"
      aria-label="글쓰기"
    >
      <Pencil className="w-6 h-6" strokeWidth={2} />
    </button>
  );
}
