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
  reviewContent: string;
  reviewCategories: number[];
  reviewImages: File[];
  setReviewContent: (content: string) => void;
  setReviewCategories: (categoryId: number) => void;
  setReviewImages: (images: File[]) => void;
  addReviewImage: (image: File) => void;
  removeReviewImage: (index: number) => void;
}

export const useClubDetailStore = create<ClubDetailState>((set) => ({
  isReviewModalOpen: false,
  reviewContent: "",
  reviewCategories: [],
  reviewImages: [],
  setReviewContent: (content: string) => set({ reviewContent: content }),
  setReviewCategories: (categoryId: number) =>
    set((state) => {
      const isSelected = state.reviewCategories.includes(categoryId);
      return {
        reviewCategories: isSelected
          ? state.reviewCategories.filter((id) => id !== categoryId)
          : [...state.reviewCategories, categoryId],
      };
    }),
  setReviewImages: (images: File[]) => set({ reviewImages: images }),
  addReviewImage: (image: File) =>
    set((state) => ({
      reviewImages: [...state.reviewImages, image],
    })),
  removeReviewImage: (index: number) =>
    set((state) => ({
      reviewImages: state.reviewImages.filter((_, i) => i !== index),
    })),
  openReviewModal: () => set({ isReviewModalOpen: true }),
  closeReviewModal: () =>
    set((state) => {
      return {
        isReviewModalOpen: false,
        rating: 0,
        reviewContent: "",
        reviewCategories: [],
        reviewImages: [],
      };
    }),
  rating: 0,
  setRating: (rating: number) =>
    set({ rating: Math.max(0, Math.min(5, rating)) }),
  resetReviewData: () =>
    set({
      rating: 0,
      reviewContent: "",
      reviewCategories: [],
      reviewImages: [],
    }),
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
