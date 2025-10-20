export const region = [
  {
    id: 1,
    label: "내 주변",
    value: "nearby",
  },
  {
    id: 2,
    label: "서울",
    value: "seoul",
  },
  {
    id: 3,
    label: "경기",
    value: "gyeonggi",
  },
  {
    id: 4,
    label: "인천",
    value: "incheon",
  },
];

export const filterItems = [
  {
    id: 1,
    options: [
      { label: "리뷰 많은 순", value: "review_count_desc" },
      { label: "리뷰 적은 순", value: "review_count_asc" },
    ],
  },
  {
    id: 2,
    options: [
      { label: "최근 리뷰 순", value: "recent_review_desc" },
      { label: "오래된 리뷰 순", value: "recent_review_asc" },
    ],
  },
  {
    id: 3,
    options: [
      { label: "평점 높은 순", value: "rating_desc" },
      { label: "평점 낮은 순", value: "rating_asc" },
    ],
  },
];
