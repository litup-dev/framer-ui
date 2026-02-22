"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { motion, AnimatePresence } from "framer-motion";

const ClubDetailImageGallery = () => {
  const {
    isImageGalleryOpen,
    imageGalleryImages,
    imageGalleryCurrentIndex,
    closeImageGallery,
    setImageGalleryIndex,
  } = useClubDetailStore();

  useEffect(() => {
    if (!isImageGalleryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (imageGalleryCurrentIndex > 0) {
          setImageGalleryIndex(imageGalleryCurrentIndex - 1);
        } else {
          setImageGalleryIndex(imageGalleryImages.length - 1);
        }
      } else if (e.key === "ArrowRight") {
        if (imageGalleryCurrentIndex < imageGalleryImages.length - 1) {
          setImageGalleryIndex(imageGalleryCurrentIndex + 1);
        } else {
          setImageGalleryIndex(0);
        }
      } else if (e.key === "Escape") {
        closeImageGallery();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isImageGalleryOpen,
    imageGalleryCurrentIndex,
    imageGalleryImages.length,
    setImageGalleryIndex,
    closeImageGallery,
  ]);

  const handleNext = () => {
    if (imageGalleryCurrentIndex < imageGalleryImages.length - 1) {
      setImageGalleryIndex(imageGalleryCurrentIndex + 1);
    } else {
      setImageGalleryIndex(0);
    }
  };

  const handlePrevious = () => {
    if (imageGalleryCurrentIndex > 0) {
      setImageGalleryIndex(imageGalleryCurrentIndex - 1);
    } else {
      setImageGalleryIndex(imageGalleryImages.length - 1);
    }
  };

  if (!isImageGalleryOpen || imageGalleryImages.length === 0) return null;

  return (
    <Dialog open={isImageGalleryOpen} onOpenChange={closeImageGallery}>
      <DialogContent
        overlayClassName="z-[999999]"
        className="!fixed !left-[50%] rounded-[6px] !top-[50%] !w-[calc(100vw-2.5rem)] xl:!w-[calc(40vw-2rem)] xl:!h-[90vh]  !max-w-none !p-0 bg-white border-none z-[1000000] !-translate-x-1/2 !-translate-y-1/2 overflow-hidden flex flex-col"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">이미지 갤러리</DialogTitle>
        <div className="relative flex-1 flex flex-col min-h-0 min-w-0 px-5 overflow-hidden">
          <button
            onClick={closeImageGallery}
            className="absolute top-5 right-5 z-50 hover:opacity-70 transition-opacity"
            aria-label="닫기"
          >
            <X className="w-4 h-4 text-black" />
          </button>

          <div className="flex-1 flex items-center justify-center min-h-0 min-w-0 overflow-hidden pb-24 xl:pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={imageGalleryCurrentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full min-w-0 min-h-0 flex items-center justify-center xl:max-w-3xl xl:max-h-[50vh] xl:mx-auto"
              >
                <Image
                  src={imageGalleryImages[imageGalleryCurrentIndex]}
                  alt={`Gallery image ${imageGalleryCurrentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 80vw, 90vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {imageGalleryImages.length > 1 && (
            <div className="absolute bottom-4 left-10 right-10 overflow-x-auto overflow-y-hidden">
              <div className="flex gap-2 sm:gap-3 justify-center py-2 min-w-max">
                {imageGalleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setImageGalleryIndex(index)}
                    className={`relative w-[clamp(80px,10vw,120px)] aspect-square flex-shrink-0 overflow-hidden transition-all ${
                      index === imageGalleryCurrentIndex
                        ? "ring-2 ring-main"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, 120px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClubDetailImageGallery;
