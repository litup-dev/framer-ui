"use client";

import { useCallback, useMemo, useState } from "react";
import { PopupNotice } from "@/app/feature/notice/types";

interface UseNoticePopupQueueArgs {
  notices: PopupNotice[] | undefined;
  dismissedIds: number[];
  isReady: boolean;
  onDismissPermanent: (id: number) => void;
}

// dismiss(영구) 안 한 popup 공지를 최신순으로 순차 노출.
// "닫기"만 누르면 sessionSkipped로 이번 진입만 스킵.
export const useNoticePopupQueue = ({
  notices,
  dismissedIds,
  isReady,
  onDismissPermanent,
}: UseNoticePopupQueueArgs) => {
  const [sessionSkipped, setSessionSkipped] = useState<number[]>([]);

  const queue = useMemo(() => {
    if (!isReady || !notices) return [];
    return notices.filter(
      (n) => !dismissedIds.includes(n.id) && !sessionSkipped.includes(n.id),
    );
  }, [notices, dismissedIds, sessionSkipped, isReady]);

  const current = queue[0];

  const closeOnly = useCallback(() => {
    if (!current) return;
    setSessionSkipped((prev) => [...prev, current.id]);
  }, [current]);

  const dismissPermanently = useCallback(() => {
    if (!current) return;
    onDismissPermanent(current.id);
  }, [current, onDismissPermanent]);

  return { current, remaining: queue.length, closeOnly, dismissPermanently };
};
