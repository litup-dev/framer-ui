"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/store/user-store";
import { logout } from "@/lib/auth-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MenuItems } from "@/app/shared/constants";
import { Subtitle } from "@/components/shared/typography";

const HeaderMenus = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    logout();
    router.push("/");
  };

  return (
    <div className="flex gap-10 items-center">
      {MenuItems.map((item) => (
        <Link key={item.id} href={item.href} className="font-semibold">
          {item.label}
        </Link>
      ))}

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.profilePath || ""}
                  alt={user?.nickname || ""}
                />
                <AvatarFallback>
                  {user?.nickname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 z-[99999999] p-2 space-y-2"
            align="end"
            forceMount
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => router.push("/user")}
            >
              <Subtitle>{user?.nickname}</Subtitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={handleLogout}
            >
              <Subtitle>로그아웃</Subtitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login" className="font-semibold">
          로그인
        </Link>
      )}
    </div>
  );
};

export default HeaderMenus;
