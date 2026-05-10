---
name: Figma 1001:1086 QA 패턴 (홈 페이지 카드/탭/캐릭터)
description: 홈 페이지 Figma node 1001:1086 구현 시 적용한 픽셀 값 및 QA 수정 패턴
type: feedback
---

## 카드 컴포넌트 픽셀 값 (Figma 1920px 기준)

**이미지 비율**: 276×345px = aspect-[4/5] (기존 aspect-[3/4] 잘못됨)
- 기존 코드: `aspect-[3/4]`
- Figma 실제: `aspect-[4/5]`

**날짜 배지**: `top-[16px] right-[16px] px-[12px] py-[9px] rounded-[3px]`
- 배경: `bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px]`
- 텍스트: `text-[16px] text-white font-bold tracking-[-0.04em]`
- 기존 코드: `xl:px-2.5 xl:py-2` (10px 8px) → 실제: 12px 9px

**카드 내부 gap**: `gap-[20px]` (Card와 CardContent 사이)
**CardContent gap**: `gap-[10px]` (텍스트 항목들 사이)
**CardContent padding**: `p-0` (기본 padding 제거 필요)

**클럽명**: `text-[16px] font-semibold tracking-[-0.04em]`
**제목**: `text-[20px] font-bold leading-[1.2] tracking-[-0.04em]`
**아티스트 태그**: `px-[12px] py-[9px] rounded-[3px] bg-[#F4F4F4] text-[16px] font-bold`
**아티스트 태그 gap**: `gap-[8px]` (flex-wrap)

**Card 자체**: `border-none shadow-none rounded-none bg-transparent`

**Why**: Figma에서 카드는 border 없이 배경 투명하고, 이미지가 4:5 비율. 기존 코드는 3:4 비율로 틀렸고 날짜 배지 패딩도 작았음.

**How to apply**: 홈 feature PerformanceCard와 all-performances PerformanceCard 모두 동일하게 적용.

## 그리드 gap 값

**홈 데스크톱 그리드 (xl 이상)**:
- `xl:gap-x-[20px] xl:gap-y-[64px]`
- Figma: 카드 x간격 20px, y간격 = 다음 행 top(1060) - 현재 행 top(537) - 카드 높이(459) = 64px

**캐러셀 카드 간격**: `-ml-[20px]` + 각 아이템 `pl-[20px]`

## SelectShow (탭) 값

**폰트**: `text-[24px]` (기존 `2xl:text-[24px]` → `xl:text-[24px]`으로 수정)
**행 간격**: `xl:gap-[20px]` (기존 `xl:gap-4`)
**2행 indent**: `xl:pl-[64px]` (Figma에서 무료공연 x=144, 금주공연 x=80 → 64px 차이)

## 전체보기 버튼 값

`border-2 border-[rgba(23,23,23,0.2)] rounded-[999px] bg-white pl-[13px] pr-[7px] py-[7px]`
- 아이콘: `w-6 h-6` (24px)

## CharacterSection (숫자 배지) 값

**Figma**: `text-[84px]`, `text-right`, `w-[79px]`, `bg-[#ff491a]`
- 기존 코드: `xl:text-[76px]` → `xl:text-[84px]`으로 수정
- 너비 고정: `xl:w-[79px]`

**위치**: CharacterSection outer div `xl:top-[314px]` + inner숫자 div `xl:top-[100px]` = 합계 414px (Figma 값)

## MainContent 레이아웃 비율

**SelectShow 너비**: `w-[16%]` (기존 `w-2/10=20%`)
- Figma: SelectShow 영역 = 297px / 1920px = 15.47% ≈ 16%
**카드 영역**: `w-[84%]`

## z-index 주의사항

CharacterSection은 `z-[1] pointer-events-none`으로 설정하고, MainContent는 `z-[10] relative`로 설정해야 카드가 캐릭터 위에 올라옴. 버튼만 `pointer-events-auto` 예외 처리 필요.

## PageWrapper pt 값

`xl:pt-[108px]` (기존 `xl:pt-24=96px`)
- Figma 헤더 100px + 히어로 SVG top=108px → 패딩 108px
