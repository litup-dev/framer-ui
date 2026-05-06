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

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer
      className={cn(
        "w-full pt-[39px] pb-[104px] pl-5 pr-5 h-[353px] flex flex-col sm:pl-10 sm:pr-10 md:pt-12 md:pb-[112px] md:pl-10 md:pr-[55px]! md:h-[333px] md:flex md:flex-col lg:pt-15 lg:pb-[124px] lg:pl-15 lg:pr-[85px] lg:h-[385px] lg:flex lg:flex-col xl:pl-[60px] xl:pr-[87px] xl:pt-20 xl:pb-20 xl:h-[377px] xl:flex xl:flex-col 2xl:pl-20 2xl:pr-[99px] 2xl:pt-20 2xl:pb-20 2xl:h-[393px] 2xl:flex 2xl:flex-col bg-[#ffffff]",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-[33px] sm:gap-8 lg:items-start xl:items-start 2xl:items-start">
        <div className="flex flex-col gap-8">
          <div className="flex gap-3 md:gap-5 lg:gap-5 xl:gap-5 2xl:gap-5 2xl:items-center">
            {FooterMenus.map((menu) => (
              <Link key={menu.id} href={menu.href}>
                <Subtitle className="text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[16px] hover:underline cursor-pointer whitespace-nowrap">
                  {menu.label}
                </Subtitle>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-12 md:gap-6 md:items-end lg:gap-8 lg:items-end xl:gap-10 xl:items-end 2xl:gap-10 2xl:items-stretch 2xl:w-[258px]">
          <div className="flex flex-col gap-2 md:gap-3 xl:gap-4 2xl:gap-4">
            {litupEmails.map((email) => (
              <div
                className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-3 2xl:gap-3 items-center whitespace-nowrap"
                key={email.id}
              >
                <Subtitle className="text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[16px]">
                  {email.label}
                </Subtitle>
                <Description className="text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[16px] font-pretendard font-normal tracking-normal">
                  {email.email}
                </Description>
              </div>
            ))}
          </div>

          <div className="pt-0 pb-0 md:self-start lg:self-start xl:self-start flex justify-end md:justify-start gap-2 items-center">
            {FooterSocials.map((social) => (
              <div key={social.id}>
                <Subtitle
                  className={cn(
                    "text-[12px] xl:text-[16px] 2xl:text-[16px] items-center justify-center flex rounded-full",
                    social.icon &&
                      "w-10 h-10 lg:size-12 xl:size-12 2xl:size-12",
                    !social.icon &&
                      "bg-[#F5F5F5] h-[40px] w-[85px] text-center xl:h-[48px] xl:w-[98px]",
                  )}
                >
                  {social.icon ? (
                    <Image
                      src={social.icon}
                      alt={social.label}
                      width={40}
                      height={40}
                      className="w-10 h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12"
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
      <div className="flex flex-col gap-4 mt-auto sm:gap-5 md:mt-auto lg:gap-6 lg:mt-auto xl:gap-6 xl:mt-auto 2xl:gap-10 2xl:mt-auto">
        <Separator className="text-black bg-[rgba(23,23,23,0.2)] md:!w-[684px] lg:!w-[904px] xl:!w-[1160px] 2xl:!w-[1760px]" />
        <Description className="text-[12px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] text-black/40 font-medium">
          ⓒ 2025 LitUp. All rights reserved.
        </Description>
      </div>
    </footer>
  );
};

export default Footer;
