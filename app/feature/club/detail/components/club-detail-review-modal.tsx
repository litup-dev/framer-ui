"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReviewStep1 } from "@/app/feature/club/detail/components/review-step1";
import { ReviewStep2 } from "@/app/feature/club/detail/components/review-step2";
import { CreateReviewResponse } from "@/app/feature/club/types";
import {
  createReviewOptions,
  updateReviewOptions,
  getReviewCategoryOptions,
} from "@/app/feature/club/query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Subtitle } from "@/components/shared/typography";

const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

const isValidImageExtension = (fileName: string): boolean => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ? ALLOWED_IMAGE_EXTENSIONS.includes(extension) : false;
};

interface ClubDetailReviewModalProps {
  entityId: number;
  clubName?: string;
  clubImage?: string;
}

const ClubDetailReviewModal = ({
  entityId,
  clubName,
  clubImage,
}: ClubDetailReviewModalProps) => {
  const queryClient = useQueryClient();
  const {
    isReviewModalOpen,
    closeReviewModal,
    reviewMode,
    reviewId,
    rating,
    resetReviewData,
    reviewContent,
    reviewCategories,
    existingReviewImages,
    newReviewImages,
  } = useClubDetailStore();

  useEffect(() => {
    if (isReviewModalOpen) {
      queryClient.prefetchQuery(getReviewCategoryOptions());
      setCurrentStep(1);
      setDirection(1);
    }
  }, [isReviewModalOpen, queryClient]);

  const handleImageUpload = async (reviewId: number) => {
    if (newReviewImages.length === 0) return;

    try {
      const formData = new FormData();
      newReviewImages.forEach((image) => {
        formData.append("image", image);
      });

      await apiClient.post(`/api/v1/upload/club-review/${reviewId}`, formData);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }
  };

  const handleMutationSuccess = async (reviewId: number) => {
    await handleImageUpload(reviewId);

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["reviews", String(entityId)],
      }),
      queryClient.invalidateQueries({
        queryKey: ["user-club-reviews"],
      }),
    ]);

    resetReviewData();
    closeReviewModal();
  };

  const { mutate: createReview, isPending: isCreatingReview } = useMutation({
    ...createReviewOptions(Number(entityId)),
    onSuccess: (data: { data: CreateReviewResponse }) => {
      if (data?.data?.id) {
        handleMutationSuccess(data.data.id);
      }
    },
  });

  const { mutate: updateReview, isPending: isUpdatingReview } = useMutation({
    ...updateReviewOptions(reviewId || 0),
    onSuccess: () => {
      if (reviewId) {
        handleMutationSuccess(reviewId);
      }
    },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const totalSteps = 2;

  const handleNext = () => {
    if (currentStep === 1 && reviewCategories.length === 0) return;
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
      return;
    }

    const hasContent = reviewContent.trim().length > 0;
    const hasImages = existingReviewImages.length + newReviewImages.length > 0;

    if (!hasContent || !hasImages) {
      return;
    }

    const hasInvalidExtension = newReviewImages.some(
      (image) => !isValidImageExtension(image.name)
    );

    if (hasInvalidExtension) {
      return;
    }

    const params = {
      content: reviewContent,
      keywords: reviewCategories,
      rating: rating,
    };

    if (reviewMode === "edit") {
      updateReview(params);
    } else {
      createReview(params);
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
      <DialogContent
        overlayClassName="z-[99999998]"
        className="bg-white max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0 z-[99999999] lg:w-[664px] lg:max-w-[664px]"
      >
        <div className="flex-1 min-h-0 overflow-y-auto">
          <DialogTitle
            className={cn(
              "flex justify-start w-full items-center gap-1 p-6 pb-0",
              currentStep === 1 && "bg-[#F2F1EE]"
            )}
          >
            <Image
              src="/images/review_modal.svg"
              alt="review-modal"
              width={24}
              height={24}
            />
            <div className="flex gap-1">
              <Subtitle>리뷰 작성하기</Subtitle>
              <Subtitle className="text-gray">
                {currentStep === 1 ? "1/2" : "2/2"}
              </Subtitle>
            </div>
          </DialogTitle>
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
                <ReviewStep1 clubName={clubName} clubImage={clubImage} />
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
                <ReviewStep2
                  rating={rating}
                  clubName={clubName}
                  clubImage={clubImage}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "flex gap-1 items-center p-5 lg:pt-14 lg:pb-12 lg:px-12 bg-white flex-shrink-0",
              "justify-end"
            )}
          >
            <div className="flex gap-1 lg:gap-2">
              {currentStep > 1 && (
                <Button
                  className="bg-gray text-black lg:w-[64px] lg:h-[44px] w-fit h-fit lg:py-3.5 lg:text-[16px]"
                  onClick={handleBack}
                >
                  이전
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={
                  isCreatingReview ||
                  isUpdatingReview ||
                  (currentStep === 2 &&
                    (reviewContent.trim().length === 0 ||
                      existingReviewImages.length + newReviewImages.length ===
                        0 ||
                      newReviewImages.some(
                        (image) => !isValidImageExtension(image.name)
                      )))
                }
                className="bg-black hover:bg-black/80 disabled:bg-gray-300 disabled:cursor-not-allowed lg:w-[64px] lg:h-[44px] w-fit h-fit lg:py-3.5 lg:text-[16px]"
              >
                {currentStep === 1
                  ? "다음"
                  : isCreatingReview || isUpdatingReview
                  ? "등록 중..."
                  : "등록"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClubDetailReviewModal;
