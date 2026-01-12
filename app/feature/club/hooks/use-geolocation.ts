import { useState, useCallback } from "react";
import { useCommonModalStore, TextAlign } from "@/store/common-modal-store";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  isAllowed: boolean | null;
  isLoading: boolean;
}

interface ErrorConfig {
  title: string;
  message: string;
}

const ERROR_CONFIGS: Record<number, ErrorConfig> = {
  1: {
    title: "위치 정보 접근 권한 거부",
    message:
      "위치 정보 접근 권한이 거부되었습니다.\n\n브라우저 설정에서 위치 권한을 리셋하려면:\n- Chrome: 주소창 왼쪽 자물쇠 아이콘 > 위치 > 리셋\n- Safari: 환경설정 > 웹사이트 > 위치 서비스\n- Firefox: 주소창 왼쪽 자물쇠 아이콘 > 권한 > 위치 > 리셋",
  },
  2: {
    title: "위치 정보 사용 불가",
    message: "위치 정보를 사용할 수 없습니다.",
  },
  3: {
    title: "요청 시간 초과",
    message: "위치 정보 요청 시간이 초과되었습니다.",
  },
};

const DEFAULT_ERROR_CONFIG: ErrorConfig = {
  title: "오류",
  message: "위치 정보를 가져오는 중 오류가 발생했습니다.",
};

const handleGeolocationError = (
  error: GeolocationPositionError,
  openModal: (params: {
    description: string;
    textAlign: TextAlign;
    confirmButton: { label: string; onClick: () => void };
    cancelButton?: { label: string; onClick: () => void };
  }) => void,
  setState: React.Dispatch<React.SetStateAction<GeolocationState>>
) => {
  const errorConfig = ERROR_CONFIGS[error.code] || DEFAULT_ERROR_CONFIG;

  setState((prev) => ({
    ...prev,
    isAllowed: false,
    isLoading: false,
  }));

  openModal({
    description: `${errorConfig.title}\n\n${errorConfig.message}`,
    textAlign: "text-start" as TextAlign,
    confirmButton: {
      label: "확인",
      onClick: () => {},
    },
  });
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    isAllowed: null,
    isLoading: false,
  });
  const { openModal } = useCommonModalStore();

  const resetGeolocation = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      isAllowed: null,
      isLoading: false,
    });
  }, []);

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      openModal({
        description: "이 브라우저는 위치 정보를 지원하지 않습니다.",
        textAlign: "text-start",
        confirmButton: {
          label: "확인",
          onClick: () => {},
        },
        cancelButton: {
          label: "취소",
          onClick: () => {},
        },
      });
      setState((prev) => ({ ...prev, isAllowed: false, isLoading: false }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isAllowed: true,
          isLoading: false,
        });
      },
      (error) => {
        handleGeolocationError(error, openModal, setState);
      }
    );
  }, [openModal]);

  return {
    ...state,
    requestGeolocation,
    resetGeolocation,
  };
};
