"use client";

import { useState } from "react";
import { ChevronRight, X, LogOut, User, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { saveReturnUrl } from "@/lib/login-utils";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

const MENU_ITEMS = [
  { label: "전체 공연", href: "/all-performances" },
  { label: "클럽 찾기", href: "/club" },
  { label: "커뮤니티", href: "/community" },
] as const;

const MobileHeader = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  const navigateTo = (href: string) => {
    router.push(href);
    closeMenu();
  };

  const handleLogout = async () => {
    await apiClient.post("/api/v1/auth/logout", {});
    queryClient.clear();
    router.push("/");
    closeMenu();
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const isClubPage = pathname === "/club";
  const isCommunityListPage = pathname === "/community";

  const openSearch = () => {
    setSearchInput(searchParams.get("keyword") ?? "");
    setIsSearchOpen(true);
  };
  const closeSearch = () => setIsSearchOpen(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("keyword", trimmed);
    } else {
      params.delete("keyword");
    }
    params.delete("page");
    router.push(`/community${params.toString() ? `?${params.toString()}` : ""}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "pl-5 pr-2 justify-between flex items-center md:hidden",
          isClubPage ? "h-12" : "h-[60px]",
        )}
      >
        <div className="flex items-center gap-1">
          <Link href="/home">
            <Image src="/images/logo.svg" alt="logo" width={77} height={24} />
          </Link>
        </div>
        <div className="flex items-center">
          {isCommunityListPage && (
            <button
              onClick={openSearch}
              className="w-12 h-12 flex items-center justify-center"
              aria-label="검색"
            >
              <Search className="w-6 h-6" strokeWidth={2} />
            </button>
          )}
          <button onClick={openMenu} className="w-12 h-12 flex items-center justify-center">
            <Image src="/images/mobile-menu.png" alt="menu" width={28} height={28} />
          </button>
        </div>
      </div>

      {/* 커뮤니티 검색 시트 */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[60] md:hidden"
              onClick={closeSearch}
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 right-0 bg-white z-[70] md:hidden shadow-md"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 px-4 h-[60px]"
              >
                <button
                  type="submit"
                  className="flex-shrink-0 text-black/60"
                  aria-label="검색"
                >
                  <Search className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="검색어를 입력해 주세요."
                  className="flex-1 bg-transparent text-[15px] font-medium text-black placeholder:text-black/30 outline-none"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex-shrink-0 text-black/60"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 bg-opacity-50 z-[60] xl:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.4,
            }}
            className="fixed top-0 right-0 h-full w-[80%] bg-white shadow-lg z-[70] xl:hidden"
          >
            <div className="flex items-center justify-end p-4">
              <X className="w-6 h-6 cursor-pointer" onClick={closeMenu} />
            </div>

            <div className="">
              <div className="flex items-center gap-2 py-[21px] border-b px-6">
                {isAuthenticated ? (
                  <div className="relative">
                    <div
                      className="flex items-center gap-2 cursor-pointerh-[72px]"
                      onClick={toggleUserDropdown}
                    >
                      <Image
                        src="/images/header-user.png"
                        alt="사용자"
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                      <div className="flex items-center">
                        <Subtitle className="text-[14px]">
                          {user?.nickname}
                        </Subtitle>
                        <ChevronRight
                          className={cn(
                            "w-5 h-5 transition-transform",
                            isUserDropdownOpen && "rotate-90",
                          )}
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        >
                          <Button
                            onClick={() => { navigateTo(`/user`); setIsUserDropdownOpen(false); }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex bg-white"
                          >
                            <User className="w-4 h-4" />
                            마이페이지
                          </Button>
                          <Button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex bg-white"
                          >
                            <LogOut className="w-4 h-4" />
                            로그아웃
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Image
                      src="/images/sidebar-user.png"
                      alt="사용자"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                    <Link
                      href="/login"
                      onClick={() => saveReturnUrl(pathname)}
                      className="flex items-center"
                    >
                      <Subtitle className="text-subtitle-14 text-black/60">
                        로그인하세요.
                      </Subtitle>
                      <ChevronRight className="w-5 h-5 text-black/60" />
                    </Link>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {MENU_ITEMS.map((item, index) => (
                  <div
                    key={index}
                    className="text-subtitle-14 cursor-pointer py-[21px] border-b px-6"
                    onClick={() => navigateTo(item.href)}
                  >
                    <Subtitle className="text-subtitle-14">
                      {item.label}
                    </Subtitle>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;
