import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  FooterMenus,
  FooterSocials,
  litupEmails,
} from "@/app/shared/constants";

import { Description, Subtitle } from "@/components/shared/typography";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="w-full pt-25 pb-25 px-10 xl:pt-25 xl:pb-10 2xl:p-20 bg-[#ffffff] 2xl:pt-40">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex gap-3 xl:gap-5">
            {FooterMenus.map((menu) => (
              <Link key={menu.id} href={menu.href}>
                <Subtitle className="text-[12px] xl:text-[14px] 2xl:text-[16px] hover:underline cursor-pointer">
                  {menu.label}
                </Subtitle>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:gap-8 2xl:gap-10">
          <div className="flex flex-col gap-2 md:gap-3 xl:gap-4">
            {litupEmails.map((email) => (
              <div className="flex gap-1 xl:gap-3 2xl:gap-4" key={email.id}>
                <Subtitle className="text-[12px] xl:text-[14px] 2xl:text-[16px]">
                  {email.label}
                </Subtitle>
                <Description className="text-[12px] xl:text-[14px] 2xl:text-[16px] font-pretendard font-normal">
                  {email.email}
                </Description>
              </div>
            ))}
          </div>

          <div className="pt-12 sm:pt-0 pb-4 sm:pb-10 flex  justify-end sm:justify-start gap-2 items-center">
            {FooterSocials.map((social) => (
              <div key={social.id}>
                <Subtitle
                  className={cn(
                    "text-[12px] xl:text-[14px] 2xl:text-[16px] bg-[#F5F5F5] items-center justify-center flex rounded-full",
                    !social.icon &&
                      "h-[40px] w-[85px] text-center xl:h-[48px] xl:w-[98px]",
                  )}
                >
                  {social.icon ? (
                    <Image
                      src={social.icon}
                      alt={social.label}
                      width={40}
                      height={40}
                      className="w-10 h-10 xl:w-12 xl:h-12"
                    />
                  ) : (
                    social.label
                  )}
                </Subtitle>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:gap-5 xl:gap-6 2xl:gap-10">
        <Separator className="text-black" />
        <Description className="text-[12px] xl:text-[14px] 2xl:text-[16px] text-black/40">
          ⓒ 2025 LitUp. All rights reserved.
        </Description>
      </div>
    </footer>
  );
};

export default Footer;
