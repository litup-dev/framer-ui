export const region = [
  {
    id: 1,
    label: "서울",
    value: "seoul",
  },
  {
    id: 2,
    label: "부산",
    value: "busan",
  },
  {
    id: 3,
    label: "그 외",
    value: "other",
  },
  {
    id: 4,
    label: "내 주변",
    value: "nearby",
  },
];

export const filterItems = [
  {
    id: 1,
    fieldName: "reviewSort" as const,
    options: [
      { label: "리뷰 많은 순", value: "-reviewCount" },
      { label: "리뷰 적은 순", value: "+reviewCount" },
    ],
  },
  {
    id: 2,
    fieldName: "reviewDate" as const,
    options: [
      { label: "최근 리뷰 순", value: "-reviewCreatedAt" },
      { label: "오래된 리뷰 순", value: "+reviewCreatedAt" },
    ],
  },
  {
    id: 3,
    fieldName: "ratingSort" as const,
    options: [
      { label: "평점 높은 순", value: "-rating" },
      { label: "평점 낮은 순", value: "+rating" },
    ],
  },
] as const;
