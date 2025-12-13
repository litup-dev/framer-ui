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
        className="!w-screen h-[90vh] !max-w-none p-0 bg-white border-none z-[1000000] !left-0 !translate-x-0 top-[5vh] !translate-y-0"
        style={{
          width: "100vw",
          maxWidth: "none",
          left: 0,
          transform: "translateX(0) translateY(0)",
          top: "5vh",
        }}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">이미지 갤러리</DialogTitle>
        <div className="relative w-full h-full flex flex-col px-10">
          <button
            onClick={closeImageGallery}
            className="absolute top-7 right-7 z-50 text-white hover:opacity-70 transition-opacity"
          >
            <X className="w-6 h-6 text-black" />
          </button>

          <div className="flex-1 flex items-center justify-center pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={imageGalleryCurrentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full max-w-5xl max-h-full"
              >
                <Image
                  src={imageGalleryImages[imageGalleryCurrentIndex]}
                  alt={`Gallery image ${imageGalleryCurrentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {imageGalleryImages.length > 1 && (
            <div className="absolute bottom-10 left-0 right-0 bg-white overflow-x-auto">
              <div className="flex gap-3 justify-center">
                {imageGalleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setImageGalleryIndex(index)}
                    className={`relative w-[120px] h-[120px] flex-shrink-0 overflow-hidden transition-all ${
                      index === imageGalleryCurrentIndex
                        ? ""
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {index === imageGalleryCurrentIndex && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          border: "2px solid #ff491a",
                          boxSizing: "border-box",
                        }}
                      />
                    )}
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
