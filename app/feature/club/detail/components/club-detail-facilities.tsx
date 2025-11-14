"use client";

import { Description, Subtitle } from "@/components/shared/typography";
import Image from "next/image";

const ClubDetailFacilities = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-gray h-[60px] rounded-[4px] p-4 md:p-6">
        <div className="flex items-center justify-around h-full">
          <div className="flex gap-2.5 items-center justify-center">
            <div className="flex items-center justify-center shrink-0">
              <Image
                src="/images/parking.svg"
                alt="parking"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col gap-0">
              <Description className="text-[12px] sm:text-[14px] text-black-80 leading-tight">
                주차
              </Description>
              <Description className="text-[12px] sm:text-[14px] text-black-80 leading-tight">
                가능
              </Description>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 shrink-0" />
          <div className="flex gap-2.5 items-center justify-center">
            <div className="flex items-center justify-center shrink-0">
              <Image
                src="/images/toilet.svg"
                alt="toilet"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col gap-0">
              <Description className="text-[12px] sm:text-[14px] text-black-80 leading-tight">
                남/녀
              </Description>
              <Description className="text-[12px] sm:text-[14px] text-black-80 leading-tight">
                화장실
              </Description>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 shrink-0" />
          <div className="flex gap-2.5 items-center justify-center">
            <div className="flex items-center justify-center shrink-0">
              <Image src="/images/wifi.svg" alt="wifi" width={20} height={20} />
            </div>
            <div className="flex flex-col gap-0">
              <Description className="text-[12px] sm:text-[14px] text-black-80 leading-tight">
                무선
              </Description>
              <Description className="text-[12px] sm:text-[14px] text-black-80 leading-tight">
                인터넷
              </Description>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailFacilities;
