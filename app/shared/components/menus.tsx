"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { MenuItems } from "@/app/shared/constants";
import Image from "next/image";

const HeaderMenus = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex gap-10 xl:gap-15 2xl:gap-20 items-center">
      {MenuItems.map((item) => (
        <Link key={item.id} href={item.href}>
          <span className="font-semibold lg:text-[16px] 2xl:text-[20px]">
            {item.label}
          </span>
        </Link>
      ))}

      {!mounted || status === "loading" ? (
        <div className="flex gap-4">
          <div className="w-6 h-6 2xl:w-7 2xl:h-7 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-6 h-6 2xl:w-7 2xl:h-7 bg-gray-200 rounded-full animate-pulse" />
        </div>
      ) : session ? (
        <div className="flex gap-4">
          <Image
            src={"/images/user.svg"}
            width={28}
            height={28}
            alt="user"
            onClick={() => router.push("/user")}
            className="cursor-pointer w-6 h-6 2xl:w-7 2xl:h-7"
          />
          <Image
            src={"/images/logout.svg"}
            width={28}
            height={28}
            alt="logout"
            onClick={() => signOut()}
            className="cursor-pointer w-6 h-6 2xl:w-7 2xl:h-7"
          />
        </div>
      ) : (
        <Link href="/login" className="font-semibold">
          <span className="text-[16px] 2xl:text-[20px]">로그인</span>
        </Link>
      )}
    </div>
  );
};

export default HeaderMenus;
