import { create } from "zustand";

interface HomeState {
  selectedCategory: "week" | "today" | "free" | "area";
  showAllItems: boolean;
  isAnimating: boolean;
  selectedArea: string;
  setSelectedCategory: (category: "week" | "today" | "free" | "area") => void;
  setShowAllItems: (show: boolean) => void;
  setIsAnimating: (animating: boolean) => void;
  handleCategoryChange: (value: "week" | "today" | "free" | "area") => void;
  handleShowAllClick: () => void;
  selectedMobileBottomNavigation: "home" | "calendar";
  setSelectedMobileBottomNavigation: (value: "home" | "calendar") => void;
  resetMobileNavigationOnDesktop: () => void;
  calendarView: "calendar" | "list";
  setCalendarView: (view: "calendar" | "list") => void;
  setSelectedArea: (area: string) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  selectedCategory: "week",
  showAllItems: false,
  isAnimating: false,
  selectedArea: "",
  selectedMobileBottomNavigation: "home",
  calendarView: "calendar",

  setSelectedCategory: (category: "week" | "today" | "free" | "area") =>
    set({ selectedCategory: category }),

  setShowAllItems: (show: boolean) => set({ showAllItems: show }),

  setIsAnimating: (animating: boolean) => set({ isAnimating: animating }),

  handleCategoryChange: (value: "week" | "today" | "free" | "area") =>
    set({ selectedCategory: value }),

  handleShowAllClick: () =>
    set((state) => ({ showAllItems: !state.showAllItems })),

  setSelectedMobileBottomNavigation: (value: "home" | "calendar") =>
    set({ selectedMobileBottomNavigation: value }),

  resetMobileNavigationOnDesktop: () =>
    set({ selectedMobileBottomNavigation: "home" }),

  setCalendarView: (view: "calendar" | "list") => set({ calendarView: view }),

  setSelectedArea: (area: string) => set({ selectedArea: area }),
}));
