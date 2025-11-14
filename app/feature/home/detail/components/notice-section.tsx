"use client";

import { useState } from "react";
import { Title, Description } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";

const NoticeSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4 -mx-5 sm:-mx-10 md:-mx-15 lg:-mx-20 w-screen sm:w-screen md:w-full lg:w-full">
      <span className="text-black text-description-14 sm:text-subtitle-20 px-5 sm:px-10 md:px-15 lg:px-20">
        notice
      </span>
      <div className="flex flex-col">
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "h-auto" : "h-[200px]"
          }`}
        >
          <Description className="text-black-80 whitespace-pre-wrap bg-[#f5f5f5] p-10 rounded-[4px]">
            공지사항 컨텐츠가 여기에 표시됩니다.
            {"\n\n"}
            여러 줄의 텍스트가 있을 수 있습니다. 이 공지사항은 공연과 관련된
            중요한 정보를 담고 있습니다. 관객 여러분께서는 아래 내용을 반드시
            확인해 주시기 바랍니다.
            {"\n\n"}
            공연 일정 및 입장 안내
            {"\n"}- 공연 시작 30분 전부터 입장이 가능합니다.
            {"\n"}- 공연 시작 후에는 입장이 제한될 수 있으니 시간 여유를 두고
            오시기 바랍니다.
            {"\n"}- 지연 입장 시 공연 진행에 따라 입장이 제한될 수 있습니다.
            {"\n\n"}
            예매 및 취소 정책
            {"\n"}- 예매 취소는 공연일 3일 전까지 가능합니다.
            {"\n"}- 취소 수수료는 취소 시점에 따라 차등 적용됩니다.
            {"\n"}- 당일 취소는 불가능하며, 환불도 불가합니다.
            {"\n\n"}
            공연장 이용 안내
            {"\n"}- 공연장 내 사진 및 동영상 촬영은 금지되어 있습니다.
            {"\n"}- 공연 중 휴대전화는 무음 모드로 설정해 주시기 바랍니다.
            {"\n"}- 음식물 반입은 제한되어 있으며, 공연장 내 흡연은 금지되어
            있습니다.
            {"\n\n"}
            교통 안내
            {"\n"}- 대중교통 이용을 권장드립니다.
            {"\n"}- 주차 공간이 제한적이오니 가급적 대중교통을 이용해 주시기
            바랍니다.
            {"\n"}- 지하철 2호선 홍대입구역 3번 출구에서 도보 5분 거리에 위치해
            있습니다.
            {"\n\n"}
            기타 안내사항
            {"\n"}- 공연장 내 화재 및 비상상황 시 안내에 따라 신속하게 대피해
            주시기 바랍니다.
            {"\n"}- 분실물은 공연장 매표소에서 보관하며, 공연 종료 후 1주일간
            보관합니다.
            {"\n"}- 문의사항이 있으시면 공연장 고객센터로 연락 주시기 바랍니다.
            {"\n\n"}
            더보기 버튼을 누르면 전체 컨텐츠를 볼 수 있습니다. 이렇게 긴 내용도
            200px 높이 제한으로 인해 일부만 보이고, 더보기 버튼을 클릭하면 전체
            내용을 확인할 수 있습니다.
          </Description>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border text-black-60 hover:text-black px-5 sm:px-10 md:px-15 lg:px-20"
        >
          {isExpanded ? "접기" : "더보기"}
        </Button>
      </div>
    </div>
  );
};

export default NoticeSection;
