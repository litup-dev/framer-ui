"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MenuItems } from "@/app/shared/constants";

const HeaderMenus = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex gap-10 items-center">
      {MenuItems.map((item) => (
        <Link key={item.id} href={item.href} className="font-semibold">
          {item.label}
        </Link>
      ))}

      {status === "loading" ? (
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      ) : session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.user?.image || ""}
                  alt={session.user?.name || ""}
                />
                <AvatarFallback>
                  {session.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{session.user?.name}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => signOut()}
            >
              로그아웃
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
