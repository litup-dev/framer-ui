import { cn } from "@/lib/utils";

// /images/map-pin.svg 와 같은 핀 (40x40 viewBox)
const PIN_PATH =
  "M20.0001 20.0007C20.9167 20.0007 21.7015 19.6743 22.3542 19.0215C23.007 18.3687 23.3334 17.584 23.3334 16.6673C23.3334 15.7507 23.007 14.9659 22.3542 14.3132C21.7015 13.6604 20.9167 13.334 20.0001 13.334C19.0834 13.334 18.2987 13.6604 17.6459 14.3132C16.9931 14.9659 16.6667 15.7507 16.6667 16.6673C16.6667 17.584 16.9931 18.3687 17.6459 19.0215C18.2987 19.6743 19.0834 20.0007 20.0001 20.0007ZM20.0001 36.6673C15.5279 32.8618 12.1876 29.327 9.97925 26.0632C7.77091 22.7993 6.66675 19.7784 6.66675 17.0007C6.66675 12.834 8.00703 9.51454 10.6876 7.04232C13.3681 4.5701 16.4723 3.33398 20.0001 3.33398C23.5279 3.33398 26.632 4.5701 29.3126 7.04232C31.9931 9.51454 33.3334 12.834 33.3334 17.0007C33.3334 19.7784 32.2292 22.7993 30.0209 26.0632C27.8126 29.327 24.4723 32.8618 20.0001 36.6673Z";

// 칩 본체 높이와 꼬리 팁 위치. 꼬리가 칩 아래로 튀어나오므로
// 오버레이의 yAnchor 기준(하단)이 꼬리 끝이 되도록 아래 여백을 둔다
const TAIL_PATH = "M0.15 0 L5.5 9.3 L10.85 0";
const TAIL_FILL_PATH = "0.15,0 10.85,0 5.5,9.3";

interface ClubMapChipProps {
  name: string;
  hasTodayPerform?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

// 지도 위 클럽 칩 (피그마: 미선택 / 선택 × 오늘 공연 유무)
const ClubMapChip = ({
  name,
  hasTodayPerform = false,
  selected = false,
  onClick,
}: ClubMapChipProps) => {
  const fill = selected ? "#FF491A" : "#FFFFFF";
  const stroke = selected ? "#FFFFFF" : hasTodayPerform ? "#FF491A" : "#E8E8E8";

  return (
    <div
      className="relative cursor-pointer select-none pb-[9px] [filter:drop-shadow(0_3px_4px_rgba(0,0,0,0.05))]"
      onClick={onClick}
    >
      <div
        className={cn(
          "flex h-[41px] items-center whitespace-nowrap rounded-[4px] border pl-[7px] pr-[11px]",
          selected
            ? "border-white bg-main text-white"
            : hasTodayPerform
              ? "border-main bg-white"
              : "border-[#E8E8E8] bg-white",
        )}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 40 40"
          fill="none"
          className="shrink-0"
          aria-hidden="true"
        >
          <path d={PIN_PATH} fill={selected ? "#FFFFFF" : "#FF491A"} />
        </svg>
        <span
          className={cn(
            "ml-[2.5px] text-[16px] font-bold leading-none tracking-[-0.02em]",
            selected ? "text-white" : "text-[#171717]",
          )}
        >
          {name}
        </span>
        {hasTodayPerform && (
          <>
            <span
              className={cn(
                "mx-1.5 h-[14px] w-px shrink-0",
                selected ? "bg-white/40" : "bg-[#CBCBCB]",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "text-[14px] font-semibold leading-none tracking-[-0.02em]",
                selected ? "text-white" : "text-main",
              )}
            >
              오늘 공연
            </span>
          </>
        )}
      </div>
      <svg
        className="absolute left-1/2 top-[40px] -ml-[5.5px] overflow-visible"
        width="11"
        height="11"
        viewBox="0 0 11 11"
        aria-hidden="true"
      >
        <polygon points={TAIL_FILL_PATH} fill={fill} />
        <path
          d={TAIL_PATH}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ClubMapChip;
