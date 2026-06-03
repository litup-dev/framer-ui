"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getPopupNoticesOptions } from "@/app/feature/notice/query-options";
import { useDismissedNotices } from "@/app/feature/notice/hooks/use-dismissed-notices";
import { useNoticePopupQueue } from "@/app/feature/notice/hooks/use-notice-popup-queue";

export const NoticePopupModal = () => {
  const { data: notices } = useQuery(getPopupNoticesOptions());
  const { dismissedIds, dismiss, isHydrated } = useDismissedNotices();

  const { current, closeOnly, dismissPermanently } = useNoticePopupQueue({
    notices,
    dismissedIds,
    isReady: isHydrated,
    onDismissPermanent: dismiss,
  });

  const [doNotShow, setDoNotShow] = useState(false);

  useEffect(() => {
    setDoNotShow(false);
  }, [current?.id]);

  const handleClose = () => {
    if (doNotShow) dismissPermanently();
    else closeOnly();
  };

  if (!current) return null;

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="p-5 md:p-8 max-w-[calc(100%-3rem)] sm:max-w-[480px] gap-3 md:gap-4 rounded-lg"
      >
        <DialogHeader className="gap-1">
          <DialogTitle className="text-[17px] md:text-[20px] text-black pr-2 leading-snug">
            {current.title}
          </DialogTitle>
          <p className="text-[12px] text-black/40">
            {format(new Date(current.createdAt), "yyyy.MM.dd")}
          </p>
        </DialogHeader>
        <div className="max-h-[65vh] md:max-h-[55vh] overflow-y-auto whitespace-pre-line text-[14px] md:text-[15px] text-black/80 leading-relaxed">
          {current.content}
        </div>
        <DialogFooter className="flex-row items-center justify-between gap-2 pt-2 md:pt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={doNotShow}
              onCheckedChange={(v) => setDoNotShow(v === true)}
            />
            <span className="text-[12px] md:text-[13px] text-black/60">
              다시 표시하지 않기
            </span>
          </label>
          <Button
            onClick={handleClose}
            className="bg-main text-white hover:bg-main/90 h-[40px] md:h-[44px] px-5 md:px-6 text-[14px] md:text-[15px]"
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
