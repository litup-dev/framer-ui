import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: "92257454663593e86ea6fe036c6f5065&autoload=false",
    libraries: ["clusterer", "drawing", "services"],
  });
}
