import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: "d0888d68595da424566fd0f2ff34c71c&autoload=false",
    libraries: ["clusterer", "drawing", "services"],
  });
}
