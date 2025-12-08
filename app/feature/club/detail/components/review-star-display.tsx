"use client";

import { Star } from "lucide-react";

interface StarDisplayProps {
  rating: number;
  size?: "sm" | "md";
}

export const StarDisplay = ({ rating, size = "sm" }: StarDisplayProps) => {
  const starSize = size === "sm" ? "w-4 h-4" : "w-8 h-8";

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, idx) => {
        const starValue = idx + 1;
        const isFilled = rating >= starValue;
        const isHalfFilled = rating >= starValue - 0.5 && rating < starValue;

        return (
          <div key={idx} className={`relative ${starSize}`}>
            <Star className="w-full h-full text-gray-300" />
            {isFilled && (
              <div className="absolute inset-0">
                <Star className="w-full h-full text-main fill-main" />
              </div>
            )}
            {isHalfFilled && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                }}
              >
                <Star className="w-full h-full text-main fill-main" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

