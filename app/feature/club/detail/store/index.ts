import { create } from "zustand";

interface ClubDetailState {
  isReviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;
  rating: number;
  setRating: (rating: number) => void;
  resetReviewData: () => void;
  isImageGalleryOpen: boolean;
  imageGalleryImages: string[];
  imageGalleryCurrentIndex: number;
  openImageGallery: (images: string[], initialIndex?: number) => void;
  closeImageGallery: () => void;
  setImageGalleryIndex: (index: number) => void;
}

export const useClubDetailStore = create<ClubDetailState>((set) => ({
  isReviewModalOpen: false,
  openReviewModal: () => set({ isReviewModalOpen: true }),
  closeReviewModal: () => set({ isReviewModalOpen: false }),
  rating: 0,
  setRating: (rating: number) =>
    set({ rating: Math.max(0, Math.min(5, rating)) }),
  resetReviewData: () => set({ rating: 0 }),
  isImageGalleryOpen: false,
  imageGalleryImages: [],
  imageGalleryCurrentIndex: 0,
  openImageGallery: (images: string[], initialIndex = 0) =>
    set({
      isImageGalleryOpen: true,
      imageGalleryImages: images,
      imageGalleryCurrentIndex: initialIndex,
    }),
  closeImageGallery: () =>
    set({
      isImageGalleryOpen: false,
      imageGalleryImages: [],
      imageGalleryCurrentIndex: 0,
    }),
  setImageGalleryIndex: (index: number) =>
    set({ imageGalleryCurrentIndex: index }),
}));
