import { getImageUrl } from "@/lib/utils";

interface KakaoShareParams {
  postTitle: string;
  authorNickname: string;
  description?: string;
  imageFilePath?: string | null;
  shareUrl: string;
}

/**
 * Kakao SDK 초기화
 */
const initializeKakao = () => {
  if (typeof window !== "undefined" && (window as any).Kakao) {
    const kakao = (window as any).Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
    return kakao;
  }
  return null;
};

const getShareImageUrl = (filePath?: string | null): string => {
  const defaultLogoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/images/logo_color.png`;
  return getImageUrl(filePath) ?? defaultLogoUrl;
};

/**
 * 커뮤니티 게시글 Kakao 공유하기
 */
export const shareToKakao = ({
  postTitle,
  authorNickname,
  description,
  imageFilePath,
  shareUrl,
}: KakaoShareParams) => {
  const kakao = initializeKakao();
  if (!kakao) {
    console.error("Kakao SDK가 로드되지 않았습니다");
    return;
  }

  const imageUrl = getShareImageUrl(imageFilePath);
  const postDescription = description || "LitUp 커뮤니티의 이야기를 확인해 보세요.";

  kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: postTitle,
      description: postDescription,
      imageUrl,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    itemContent: {
      profileText: authorNickname,
    },
    buttons: [
      {
        title: "게시글 보기",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });
};
