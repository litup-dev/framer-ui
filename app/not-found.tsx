import Link from "next/link";
import Image from "next/image";
import { House, Search } from "lucide-react";

import { Subtitle, Description, Title } from "@/components/shared/typography";
import Header from "@/app/shared/components/header";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGE = `이 페이지의 소리가 끊어져 버렸어요.\n하지만 다른 곳에서 음악은 계속되고 있어요.`;

const BUTTONS = [
  { icon: House, label: "홈으로 돌아가기", href: "/home" },
  { icon: Search, label: "공연 찾아보기", href: "/home" },
] as const;

const BUTTON_CLASSES = {
  mobile:
    "rounded-[3px] h-[60px] bg-white text-black border-[1.5px] border-black",
  desktop:
    "rounded-[3px] lg:rounded-[4px] w-[116px] h-[30px] xl:w-[137px] xl:h-[36px] 2xl:w-[153px] 2xl:h-[40px] bg-white text-black border-[1.5px] border-black hover:bg-gray-50 flex items-center justify-center gap-2",
} as const;

export default function NotFound() {
  return (
    <div>
      <Header />

      <div className="px-6 pt-5 flex flex-col min-h-[calc(100vh-80px)] sm:hidden">
        <div className="flex flex-col flex-shrink-0">
          <Image
            src="/images/404.svg"
            alt="404"
            width={144}
            height={104}
            className="pb-6"
          />
          <div className="flex flex-col gap-3.5">
            <Title className="bg-main w-fit text-[24px]">sound cuts out!</Title>
            <Description className="text-[14px] leading-[160%] whitespace-pre-wrap">
              {ERROR_MESSAGE}
            </Description>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="w-[160px] h-[160px] bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
            일러스트
          </div>
        </div>

        <div className="flex-shrink-0 pb-10 pt-4">
          <div className="flex flex-col gap-2">
            {BUTTONS.map(({ icon: Icon, label, href }) => (
              <Button key={label} asChild className={BUTTON_CLASSES.mobile}>
                <Link href={href}>
                  <Icon className="w-4 h-4" />
                  <Subtitle className="text-[14px]">{label}</Subtitle>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex min-h-[calc(100vh-80px)] items-center justify-center px-10 xl:px-15 2xl:px-20 py-10">
        <div className="flex items-center gap-5 lg:gap-7.5 2xl:gap-10">
          <div className="flex items-start justify-start">
            <Image
              src="/images/404.svg"
              alt="404"
              width={253}
              height={188}
              className="lg:w-[286px] lg:h-[208px] xl:w-[316px] xl:h-[244px] 2xl:w-[345px] 2xl:h-[280px]"
            />
          </div>

          <div className="flex flex-col gap-3.5 lg:gap-4 2xl:gap-5">
            <Title className="text-[28px] 2xl:text-[40px] text-black bg-main w-fit">
              sound cuts out!
            </Title>

            <Description className="text-[14px] xl:text-[18px] leading-[160%] whitespace-pre-wrap text-left">
              {ERROR_MESSAGE}
            </Description>

            <div className="flex flex-row gap-3 lg:gap-4 pt-2 md:pt-4 2xl:pt-5">
              {BUTTONS.map(({ icon: Icon, label, href }) => (
                <Button key={label} asChild className={BUTTON_CLASSES.desktop}>
                  <Link href={href}>
                    <Icon className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
                    <Subtitle className="text-[12px] xl:text-[14px] 2xl:text-[16px]">
                      {label}
                    </Subtitle>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
