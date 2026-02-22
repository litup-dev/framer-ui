"use client";

import { useState } from "react";
import { ChevronRight, MenuIcon, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { logout } from "@/lib/auth-utils";
import { saveReturnUrl } from "@/lib/login-utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";
import Image from "next/image";

const MENU_ITEMS = [
  { label: "전체 공연", href: "/all-performances" },
  { label: "클럽 찾기", href: "/club" },
  { label: "커뮤니티", href: "/community" },
] as const;

const MobileHeader = () => {
  const { user, isAuthenticated } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  const navigateTo = (href: string) => {
    router.push(href);
    closeMenu();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/home");
    closeMenu();
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <>
      <div className="pl-5 pr-2 py-2 justify-between flex items-center md:hidden">
        <div className="flex items-center gap-1">
          <Link href="/home">
            <Image src="/images/logo.svg" alt="logo" width={80} height={26} />
          </Link>
        </div>
        <button onClick={openMenu}>
          <Image src="/images/menu.svg" alt="menu" width={48} height={48} />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 bg-opacity-50 z-[60] md:hidden"
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
            className="fixed top-0 right-0 h-full w-[80%] bg-white shadow-lg z-[70] md:hidden"
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
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.profilePath || ""} />
                        <AvatarFallback>
                          {user?.nickname?.charAt(0) || ""}
                        </AvatarFallback>
                      </Avatar>
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
                    <div className="bg-gray-100 rounded-full">
                      <User className="w-8 h-8 text-gray-300 fill-gray-300 p-1" />
                    </div>
                    <div className="flex">
                      <Link
                        href="/login"
                        onClick={() => saveReturnUrl(pathname)}
                      >
                        <Subtitle className="text-subtitle-14">
                          로그인하세요
                        </Subtitle>
                      </Link>
                      <ChevronRight className="w-5 h-5" />
                    </div>
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
