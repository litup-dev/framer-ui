"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import type { PostImage } from "../types";

interface CommunityPostImageGalleryProps {
  images: PostImage[];
}

export function CommunityPostImageGallery({ images }: CommunityPostImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, prev, next]);

  const gridClass =
    images.length === 1
      ? "grid grid-cols-1"
      : images.length === 2
        ? "grid grid-cols-2"
        : "grid grid-cols-2 md:grid-cols-3";

  return (
    <>
      <div className={`${gridClass} gap-2`}>
        {images.map((img, idx) => {
          const url = getImageUrl(img.filePath);
          if (!url) return null;
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-black/5 group"
              aria-label={`이미지 ${idx + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
            </button>
          );
        })}
      </div>

      {activeIndex !== null && (
        <Lightbox
          image={images[activeIndex]}
          currentIndex={activeIndex}
          total={images.length}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}

interface LightboxProps {
  image: PostImage;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ image, currentIndex, total, onClose, onPrev, onNext }: LightboxProps) {
  const url = getImageUrl(image.filePath);
  const hasMultiple = total > 1;

  return (
    <div
      className="fixed inset-0 z-[9999999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="닫기"
      >
        <X className="w-5 h-5" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="이전"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="다음"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white text-[13px] font-medium">
            {currentIndex + 1} / {total}
          </div>
        </>
      )}

      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="max-w-[92vw] max-h-[85vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
