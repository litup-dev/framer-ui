import { create } from "zustand";

interface UserReviewModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  reviewId: number | null;
  clubId: number | null;
  rating: number;
  content: string;
  categories: number[];
  images: File[];
  existingImagePaths: string[];
  openModal: (params: {
    mode: "create" | "edit";
    clubId: number;
    reviewId?: number;
    rating?: number;
    content?: string;
    categories?: number[];
    existingImagePaths?: string[];
  }) => void;
  closeModal: () => void;
  setRating: (rating: number) => void;
  setContent: (content: string) => void;
  setCategories: (categoryId: number) => void;
  setImages: (images: File[]) => void;
  addImage: (image: File) => void;
  removeImage: (index: number) => void;
  resetData: () => void;
}

export const useUserReviewModalStore = create<UserReviewModalState>((set) => ({
  isOpen: false,
  mode: "create",
  reviewId: null,
  clubId: null,
  rating: 0,
  content: "",
  categories: [],
  images: [],
  existingImagePaths: [],

  openModal: ({
    mode,
    clubId,
    reviewId = null,
    rating = 0,
    content = "",
    categories = [],
    existingImagePaths = [],
  }) =>
    set({
      isOpen: true,
      mode,
      clubId,
      reviewId,
      rating,
      content,
      categories,
      existingImagePaths,
      images: [],
    }),

  closeModal: () =>
    set({
      isOpen: false,
      mode: "create",
      reviewId: null,
      clubId: null,
      rating: 0,
      content: "",
      categories: [],
      images: [],
      existingImagePaths: [],
    }),

  setRating: (rating: number) =>
    set({ rating: Math.max(0, Math.min(5, rating)) }),

  setContent: (content: string) => set({ content }),

  setCategories: (categoryId: number) =>
    set((state) => {
      const isSelected = state.categories.includes(categoryId);
      return {
        categories: isSelected
          ? state.categories.filter((id) => id !== categoryId)
          : [...state.categories, categoryId],
      };
    }),

  setImages: (images: File[]) => set({ images }),

  addImage: (image: File) =>
    set((state) => ({
      images: [...state.images, image],
    })),

  removeImage: (index: number) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),

  resetData: () =>
    set({
      rating: 0,
      content: "",
      categories: [],
      images: [],
      existingImagePaths: [],
    }),
}));
