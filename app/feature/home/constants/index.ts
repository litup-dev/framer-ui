export interface SelectItem {
  id: number;
  label: string;
  value: "week" | "today" | "free" | "area";
  region?: Array<{
    id: number;
    label: string;
    value: "seoul" | "hongdae" | "busan";
  }>;
}

export const SELECT_ITEMS: SelectItem[] = [
  {
    id: 1,
    label: "금주공연",
    value: "week",
  },
  {
    id: 2,
    label: "오늘공연",
    value: "today",
  },
  {
    id: 3,
    label: "무료공연",
    value: "free",
  },
  {
    id: 4,
    label: "지역별",
    value: "area",
    region: [
      {
        id: 1,
        label: "서울",
        value: "seoul",
      },
      {
        id: 2,
        label: "홍대",
        value: "hongdae",
      },
      {
        id: 3,
        label: "부산",
        value: "busan",
      },
    ],
  },
];

export type SelectItemValue = SelectItem["value"];
export type RegionValue = NonNullable<SelectItem["region"]>[number]["value"];
