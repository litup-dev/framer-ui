import { getImageUrl } from "@/lib/utils";

interface KakaoShareParams {
  performanceTitle: string;
  clubName: string;
  description?: string;
  performDate?: string;
  artists?: Array<{ name: string }>;
  images?: Array<{ filePath: string; isMain: boolean }>;
  shareUrl: string;
}

/**
 * Kakao SDK 초기화
 */
export const initializeKakao = () => {
  if (typeof window !== "undefined" && (window as any).Kakao) {
    const kakao = (window as any).Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
    return kakao;
  }
  return null;
};

/**
 * 메인 이미지 URL 가져오기
 */
const getMainImageUrl = (
  images?: Array<{ filePath: string; isMain: boolean }>
): string | null => {
  if (!images || images.length === 0) return null;
  const mainImage = images.find((img) => img.isMain) || images[0];
  return mainImage ? getImageUrl(mainImage.filePath) : null;
};

/**
 * Kakao 공유 아이템 리스트 생성
 */
const createKakaoItems = (
  performDate?: string,
  artists?: Array<{ name: string }>,
  clubName?: string
): any[] => {
  const items: any[] = [];

  if (performDate) {
    items.push({
      item: "공연 일자",
      itemOp: new Date(performDate).toLocaleDateString("ko-KR"),
    });
  }

  if (artists && artists.length > 0) {
    const artistNames = artists.map((a) => a.name).join(", ");
    items.push({
      item: "아티스트",
      itemOp: artistNames,
    });
  }

  if (clubName) {
    items.push({
      item: "클럽",
      itemOp: clubName,
    });
  }

  return items;
};

/**
 * 텍스트 형식 Kakao 공유 (이미지 없을 때)
 */
const shareAsText = (
  kakao: any,
  performanceTitle: string,
  performDate?: string,
  artists?: Array<{ name: string }>,
  clubName?: string,
  shareUrl?: string
) => {
  const textDetails: string[] = [];

  if (performDate) {
    textDetails.push(
      `📅 ${new Date(performDate).toLocaleDateString("ko-KR")}`
    );
  }

  if (artists && artists.length > 0) {
    const artistNames = artists.map((a) => a.name).join(", ");
    textDetails.push(`🎤 ${artistNames}`);
  }

  if (clubName) {
    textDetails.push(`🏛️ ${clubName}`);
  }

  kakao.Share.sendDefault({
    objectType: "text",
    text: `${performanceTitle}\n\n${textDetails.join("\n")}`,
    link: {
      mobileWebUrl: shareUrl,
      webUrl: shareUrl,
    },
    buttons: [
      {
        title: "공연 정보 확인",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });
};

/**
 * 피드 형식 Kakao 공유 (이미지 있을 때)
 */
const shareAsFeed = (
  kakao: any,
  performanceTitle: string,
  description: string,
  imageUrl: string,
  items: any[],
  shareUrl: string
) => {
  kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: description,
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    itemContent: {
      profileText: performanceTitle,
      items: items,
    },
    buttons: [
      {
        title: "공연 정보 확인",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });
};

/**
 * Kakao 공유하기
 */
export const shareToKakao = ({
  performanceTitle,
  clubName,
  description,
  performDate,
  artists,
  images,
  shareUrl,
}: KakaoShareParams) => {
  const kakao = initializeKakao();
  if (!kakao) {
    console.error("Kakao SDK가 로드되지 않았습니다");
    return;
  }

  const imageUrl = getMainImageUrl(images);
  const performanceDescription =
    description || "인디 씬을 사랑하는 사람들이 모이는 공간.";

  // 이미지가 없으면 text 타입으로 공유
  if (!imageUrl) {
    shareAsText(kakao, performanceTitle, performDate, artists, clubName, shareUrl);
    return;
  }

  // 이미지가 있으면 feed 타입으로 공유
  const items = createKakaoItems(performDate, artists, clubName);
  shareAsFeed(kakao, performanceTitle, performanceDescription, imageUrl, items, shareUrl);
};
