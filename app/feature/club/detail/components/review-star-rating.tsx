"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

const DEFAULT_RATING = 0.5;

export const StarRating = () => {
  const { rating, setRating } = useClubDetailStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayRating, setDisplayRating] = useState(DEFAULT_RATING);

  useEffect(() => {
    const value = Number(rating) || DEFAULT_RATING;
    setDisplayRating(value);
    if (rating === 0) setRating(DEFAULT_RATING);
  }, [rating, setRating]);

  const calculateRating = (clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    const calculatedRating = Math.round(percentage * 10) / 2;
    return Math.max(0, Math.min(5, calculatedRating));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const newRating = calculateRating(e.clientX);
    setRating(newRating);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newRating = calculateRating(e.clientX);
      setRating(newRating);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const newRating = calculateRating(touch.clientX);
    setRating(newRating);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const newRating = calculateRating(touch.clientX);
      setRating(newRating);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = displayRating >= starValue;
    const isHalfFilled =
      displayRating >= starValue - 0.5 && displayRating < starValue;

    return (
      <div key={index} className="relative w-8 h-8">
        <Star className="w-full h-full text-gray-300" />
        {isFilled && (
          <div className="absolute inset-0 z-10">
            <Star className="w-full h-full text-main fill-main" />
          </div>
        )}
        {isHalfFilled && (
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          >
            <Star className="w-full h-full text-main fill-main" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-2 cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {Array.from({ length: 5 }).map((_, index) => renderStar(index))}
    </div>
  );
};
