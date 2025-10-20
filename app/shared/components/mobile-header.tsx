"use client";

import { useState } from "react";
import { ChevronRight, MenuIcon, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import Logo from "@/app/shared/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
  { label: "클럽 찾기", href: "/club" },
  { label: "커뮤니티", href: "/community" },
] as const;

const MobileHeader = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();

  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  const navigateTo = (href: string) => {
    router.push(href);
    closeMenu();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/home" });
    closeMenu();
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const isAuthenticated = status === "authenticated";

  return (
    <>
      <div className="px-5 py-2 justify-between flex items-center sm:hidden">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-black" />
          <Link href="/home">logo</Link>
        </div>
        <button onClick={openMenu} className="p-2">
          <MenuIcon className="w-6 h-6" />
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

            <div className="px-10 space-y-14">
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <div className="relative">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={toggleUserDropdown}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback>
                          {session?.user?.name?.charAt(0) || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex">
                        <p className="text-subtitle-14">
                          {session?.user?.name}
                        </p>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            isUserDropdownOpen ? "rotate-90" : ""
                          }`}
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
                      <Link href="/login">
                        <p className="text-subtitle-14">로그인하세요</p>
                      </Link>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-6">
                {MENU_ITEMS.map((item, index) => (
                  <p
                    key={index}
                    className="text-subtitle-14 cursor-pointer"
                    onClick={() => navigateTo(item.href)}
                  >
                    {item.label}
                  </p>
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
