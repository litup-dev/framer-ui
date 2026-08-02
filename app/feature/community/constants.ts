import type { BoardCode, CategoryCode } from "./types";

export const BOARD_OPTIONS: { code: BoardCode; label: string }[] = [
  { code: "FREE", label: "자유 게시판" },
];

export const CATEGORY_OPTIONS_BY_BOARD: Record<
  BoardCode,
  { code: CategoryCode; label: string }[]
> = {
  FREE: [
    { code: "GENERAL", label: "일반글" },
    { code: "BAND_PROMO", label: "밴드 홍보" },
    { code: "PERFORM_REVIEW", label: "공연 후기" },
  ],
};

export function boardLabel(code: BoardCode): string {
  return BOARD_OPTIONS.find((b) => b.code === code)?.label ?? code;
}

export function categoryLabel(
  boardCode: BoardCode,
  categoryCode: CategoryCode,
): string {
  return (
    CATEGORY_OPTIONS_BY_BOARD[boardCode]?.find((c) => c.code === categoryCode)
      ?.label ?? categoryCode
  );
}
