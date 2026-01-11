import { create } from "zustand";

interface ClubDetailState {
  isReviewModalOpen: boolean;
  reviewMode: "create" | "edit";
  reviewId: number | null;
  openReviewModal: (params?: {
    mode?: "create" | "edit";
    reviewId?: number;
    rating?: number;
    content?: string;
    categories?: number[];
    images?: string[];
  }) => void;
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
  existingReviewImages: string[];
  newReviewImages: File[];
  setReviewContent: (content: string) => void;
  setReviewCategories: (categoryId: number) => void;
  setReviewImages: (images: File[]) => void;
  addReviewImage: (image: File) => void;
  removeNewReviewImage: (index: number) => void;
  removeExistingReviewImage: (index: number) => void;
}

export const useClubDetailStore = create<ClubDetailState>((set) => ({
  isReviewModalOpen: false,
  reviewMode: "create",
  reviewId: null,
  reviewContent: "",
  reviewCategories: [],
  existingReviewImages: [],
  newReviewImages: [],
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
  setReviewImages: (images: File[]) => set({ newReviewImages: images }),
  addReviewImage: (image: File) =>
    set((state) => ({
      newReviewImages: [...state.newReviewImages, image],
    })),
  removeNewReviewImage: (index: number) =>
    set((state) => ({
      newReviewImages: state.newReviewImages.filter((_, i) => i !== index),
    })),
  removeExistingReviewImage: (index: number) =>
    set((state) => ({
      existingReviewImages: state.existingReviewImages.filter(
        (_, i) => i !== index
      ),
    })),
  openReviewModal: (params) =>
    set({
      isReviewModalOpen: true,
      reviewMode: params?.mode || "create",
      reviewId: params?.reviewId || null,
      rating: params?.rating || 0,
      reviewContent: params?.content || "",
      reviewCategories: params?.categories || [],
      existingReviewImages: params?.images || [],
      newReviewImages: [],
    }),
  closeReviewModal: () =>
    set({
      isReviewModalOpen: false,
      reviewMode: "create",
      reviewId: null,
      rating: 0,
      reviewContent: "",
      reviewCategories: [],
      existingReviewImages: [],
      newReviewImages: [],
    }),
  rating: 0,
  setRating: (rating: number) =>
    set({ rating: Math.max(0, Math.min(5, rating)) }),
  resetReviewData: () =>
    set({
      rating: 0,
      reviewContent: "",
      reviewCategories: [],
      existingReviewImages: [],
      newReviewImages: [],
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
