"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReviewStep1 } from "@/app/feature/club/detail/components/review-step1";
import { ReviewStep2 } from "@/app/feature/club/detail/components/review-step2";

const ClubDetailReviewModal = () => {
  const { isReviewModalOpen, closeReviewModal, rating, resetReviewData } =
    useClubDetailStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const totalSteps = 2;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setDirection(1);
    resetReviewData();
    closeReviewModal();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const slideTransition = {
    type: "tween" as const,
    ease: [0.4, 0, 0.2, 1] as const,
    duration: 0.3,
  };

  return (
    <Dialog
      open={isReviewModalOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="bg-white max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0 z-[99999999]">
        <DialogTitle
          className={cn(
            "flex justify-start w-full items-center gap-1 p-6 pb-0 flex-shrink-0 ",
            currentStep === 1 && "bg-[#F2F1EE]"
          )}
        >
          <Image
            src="/images/review_modal.svg"
            alt="review-modal"
            width={24}
            height={24}
          />
          리뷰 작성하기
        </DialogTitle>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
              >
                <ReviewStep1 />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
              >
                <ReviewStep2 rating={rating} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-1 items-center p-6  bg-white flex-shrink-0">
            <Button
              onClick={handleNext}
              className="bg-black rounded-[4px] hover:bg-black/80"
            >
              다음
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-[4px]"
            >
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClubDetailReviewModal;
