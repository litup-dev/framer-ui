export const MenuItems = [
  {
    id: 1,
    label: "전체 공연",
    href: "/all-performances",
  },
  {
    id: 2,
    label: "클럽 찾기",
    href: "/club",
  },
  {
    id: 3,
    label: "커뮤니티",
    href: "/contact",
  },
];

export const FooterMenus = [
  {
    id: 1,
    label: "공지사항",
    href: "/notice",
  },
  {
    id: 2,
    label: "이용약관",
    href: "/terms-of-service",
  },
  {
    id: 3,
    label: "위치기반서비스 이용약관",
    href: "/location-based-service-terms-of-service",
  },
  {
    id: 4,
    label: "개인정보처리방침",
    href: "/privacy-policy",
  },
];

export const FooterSocials = [
  {
    id: 1,
    label: "X",
    icon: "/images/social-x.svg",
    href: "https://www.instagram.com/example",
  },
  {
    id: 2,
    label: "Instagram",
    icon: "/images/social-instagram.svg",
    href: "https://www.instagram.com/example",
  },
  // {
  //   id: 3,
  //   label: "앱 다운로드",
  //   href: "https://www.facebook.com/example",
  // },
];

export const litupEmails = [
  {
    id: 1,
    label: "대표메일",
    email: "litup.live@gmail.com",
  },
  {
    id: 2,
    label: "문의메일",
    email: "litup.helpdesk@gmail.com",
  },
];

export const MyPageMenuItems = [
  {
    id: 1,
    label: "나의 활동",
    subItems: [
      { label: "공연 코멘트", href: "/user/comments" },
      { label: "클럽 리뷰", href: "/user/reviews" },
    ],
  },
  {
    id: 2,
    label: "나의 정보",
    subItems: [
      { label: "공개범위 설정", href: "/user/privacy" },
      { label: "회원정보관리", href: "/user/account" },
    ],
  },
];

export const REPORT_CATEGORIES = [
  { id: "spam", label: "스팸/광고성 콘텐츠" },
  { id: "hate", label: "욕설 및 혐오 발언" },
  { id: "copyright", label: "저작권 침해" },
  { id: "privacy", label: "개인정보 노출" },
  { id: "misinformation", label: "허위 정보" },
  { id: "illegal", label: "불법 행위" },
  { id: "adult", label: "음란/성적 콘텐츠" },
  { id: "etc", label: "기타" },
] as const;
