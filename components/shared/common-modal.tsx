"use client";

import { useCommonModalStore } from "@/store/common-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Subtitle } from "./typography";
import { cn } from "@/lib/utils";

export const CommonModal = () => {
  const {
    isOpen,
    description,
    textAlign,
    confirmButton,
    cancelButton,
    closeModal,
  } = useCommonModalStore();

  const handleConfirm = () => {
    confirmButton.onClick();
    closeModal();
  };

  const handleCancel = () => {
    cancelButton.onClick();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false} className="p-10">
        <DialogTitle className="sr-only">알림</DialogTitle>
        <DialogDescription className={cn("whitespace-pre-line text-[18px] text-black font-bold", textAlign)}>
          {description}
        </DialogDescription>
        <DialogFooter className="flex-row gap-2 pt-12">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-[#F5F5F5] text-black hover:bg-gray-100 flex-1 h-[63px]"
          >
            <Subtitle className="text-[16px]">{cancelButton.label}</Subtitle>
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-black text-white hover:bg-gray-800 flex-1 h-[63px]"
          >
            <Subtitle className="text-[16px]">{confirmButton.label}</Subtitle>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
