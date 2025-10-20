import { create } from "zustand";

interface HomeState {
  selectedCategory: string;
  showAllItems: boolean;
  isAnimating: boolean;
  setSelectedCategory: (category: string) => void;
  setShowAllItems: (show: boolean) => void;
  setIsAnimating: (animating: boolean) => void;
  handleCategoryChange: (value: string) => void;
  handleShowAllClick: () => void;
  selectedMobileBottomNavigation: "home" | "calendar";
  setSelectedMobileBottomNavigation: (value: "home" | "calendar") => void;
  resetMobileNavigationOnDesktop: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  selectedCategory: "week",
  showAllItems: false,
  isAnimating: false,
  selectedMobileBottomNavigation: "home",

  setSelectedCategory: (category: string) =>
    set({ selectedCategory: category }),

  setShowAllItems: (show: boolean) => set({ showAllItems: show }),

  setIsAnimating: (animating: boolean) => set({ isAnimating: animating }),

  handleCategoryChange: (value: string) => set({ selectedCategory: value }),

  handleShowAllClick: () =>
    set((state) => ({ showAllItems: !state.showAllItems })),

  setSelectedMobileBottomNavigation: (value: "home" | "calendar") =>
    set({ selectedMobileBottomNavigation: value }),

  resetMobileNavigationOnDesktop: () =>
    set({ selectedMobileBottomNavigation: "home" }),
}));
