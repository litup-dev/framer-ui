export interface PromoItem {
  id: number;
  /** 줄바꿈(\n)으로 두 줄 구성 */
  title: string;
  /** 744 미만에서 대체 노출할 짧은 제목 (피그마 모바일 시안은 문구가 더 짧음) */
  mobileTitle?: string;
  /** 없으면 피그마 플레이스홀더(#d9d9d9)로 표시 */
  image?: string;
  href: string;
}

// 피그마 시안 기준 더미 데이터 (API 연동 전까지 사용)
export const PROMO_DUMMY_ITEMS: PromoItem[] = Array.from(
  { length: 9 },
  (_, i) => ({
    id: i + 1,
    title: "밴드, 클럽 등 홍보 섹션\n홍보 콘텐츠 제목",
    mobileTitle: "밴드, 클럽 등 섹션\n홍보 콘텐츠 제목",
    href: "#",
  }),
);
