# 성능 개선 작업 기록

## 작업 일자
2026-05-26

---

## 완료된 작업

### 1순위 — Next.js 이미지 최적화 활성화

**파일:** `next.config.ts`

**문제:**
```ts
images: {
  unoptimized: true,  // 이미지 최적화 완전 비활성화
}
```
`unoptimized: true` 옵션은 Next.js `next/image`의 핵심 최적화 기능을 모두 끕니다.
- WebP/AVIF 포맷 자동 변환 없음
- viewport 크기에 맞는 리사이징 없음
- 이미지 압축 없음
- 결과적으로 모든 이미지가 원본 크기·포맷 그대로 전송

**수정:**
```ts
// before
images: {
  unoptimized: true,
  remotePatterns,
}

// after
images: {
  remotePatterns,
}
```

**기대 효과:**
- 이미지 전송 용량 50~80% 감소 (WebP 변환 기준)
- LCP(Largest Contentful Paint) 단축
- 대역폭 절감

**주의사항:**
`NEXT_PUBLIC_IMAGE_PREFIX_URL` 환경변수에 이미지 서버 도메인이 올바르게 설정되어 있어야 합니다.
`remotePatterns`에 이미지 도메인이 포함되지 않으면 `next/image`가 해당 이미지를 최적화하지 않습니다.

---

### 2순위 — `home/layout.tsx` 쉼표 연산자 버그 수정

**파일:** `app/(route)/home/layout.tsx`

**문제:**
```ts
initialPageParam: (new Date(), "yyyy-MM"),
```
JavaScript **쉼표 연산자(comma operator)** 는 좌측 피연산자를 평가 후 버리고 우측 값을 반환합니다.
따라서 `pageParam`이 실제 날짜가 아니라 리터럴 문자열 `"yyyy-MM"` 으로 고정되어
서버에서 `/api/v1/performances/calendar?month=yyyy-MM` 를 요청하게 됩니다.
응답은 항상 빈 데이터이므로 이 prefetch는 의도와 달리 **완전히 무효화**된 상태였습니다.

---

### 3순위 — 캘린더 이중 Prefetch 제거

**파일:** `app/(route)/home/layout.tsx`

**문제:**
```
서버 렌더링 시
  layout.tsx → prefetchInfiniteQuery("calendarEventsList")   ← 2순위 버그로 항상 실패
  page.tsx   → prefetchQuery("calendarEvents", "2025-05")    ← 정상 동작
               prefetchQuery("calendarEvents", "2025-04")
               prefetchQuery("calendarEvents", "2025-06")

클라이언트 hydration 후
  HomeContent      → useQuery("calendarEvents", month)       ← page.tsx 캐시 히트 ✅
  CalendarListView → useInfiniteQuery("calendarEventsList")  ← layout 버그로 캐시 미스, 재요청 ❌
```

`layout.tsx`의 `calendarEventsList` prefetch와 `page.tsx`의 `calendarEvents/{month}` prefetch가
동일한 API 엔드포인트를 **서로 다른 queryKey**로 중복 관리하고 있었습니다.

- `calendarEvents` (단일 쿼리): 캘린더 그리드 뷰에서 사용
- `calendarEventsList` (infinite 쿼리): 캘린더 리스트 뷰에서 사용 (비기본 뷰)

리스트 뷰는 사용자가 직접 전환해야 노출되는 **비기본 화면**이므로, 매 페이지 로드마다
서버에서 미리 prefetch할 필요가 없습니다.

**수정:**
`layout.tsx`에서 prefetch 블록 전체를 제거했습니다.

```ts
// before
export default async function HomeLayout({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["calendarEventsList"],
    initialPageParam: (new Date(), "yyyy-MM"),  // 버그
    queryFn: async ({ pageParam }) => { ... },
    getNextPageParam: (...) => { ... },
  });
  return (
    <div className="relative overflow-x-hidden">
      <HomeCharacterImage />
      {children}
    </div>
  );
}

// after
export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative overflow-x-hidden">
      <HomeCharacterImage />
      {children}
    </div>
  );
}
```

**기대 효과:**
- 서버에서 불필요한 API 호출 1회 제거 (매 `/home` 요청마다)
- `async` 서버 컴포넌트 → 동기 컴포넌트로 전환, layout 렌더링 지연 제거
- `CalendarListView`는 사용자가 리스트 뷰로 전환할 때 클라이언트에서 fetch (정상 동작)

---

## 잔여 개선 항목 (미완료)

| 우선순위 | 문제 | 비고 |
|---------|------|------|
| 4 | 불필요한 Geist 폰트 Google CDN 로드 제거 (`app/layout.tsx`) | Geist 폰트가 실제로 사용되는지 확인 후 제거 |
| 5 | Kakao SDK를 RootLayout에서 제거, 필요한 페이지에서만 지연 로드 | 공연 상세 페이지에서만 사용됨 |
| 6 | `force-dynamic` → `revalidate` 전환 (`home/page.tsx`) | 공연 데이터 갱신 주기에 맞춰 설정 필요 |
| 7 | `useResponsive` 다수 인스턴스 → 단일 Context 또는 custom hook 통합 | resize 리스너 중복, hydration 레이아웃 시프트 |
| 8 | `MobileMainContent` 별도 `useInfiniteQuery` → 상위에서 props 전달로 교체 | 클라이언트 fetch 중복 |
| 9 | Desktop/Mobile 컴포넌트 CSS-only 숨김 → 조건부 렌더링 전환 | 숨겨진 이미지도 모두 로드됨 |
| 10 | `handlePageChange` 내 `setTimeout` polling 제거 | React Query `isFetching` 상태 활용으로 교체 |
