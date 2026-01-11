import { create } from "zustand";

interface ReportModalState {
  isOpen: boolean;
  targetContent: React.ReactNode;
  typeId: number;
  entityId: number;
  onSubmit: (categoryId: string, content: string) => void;
  openModal: (params: {
    targetContent: React.ReactNode;
    typeId: number;
    entityId: number;
    onSubmit: (categoryId: string, content: string) => void;
  }) => void;
  closeModal: () => void;
}

export const useReportModalStore = create<ReportModalState>((set) => ({
  isOpen: false,
  targetContent: null,
  typeId: 1,
  entityId: 0,
  onSubmit: () => {},
  openModal: (params) =>
    set({
      isOpen: true,
      targetContent: params.targetContent,
      typeId: params.typeId,
      entityId: params.entityId,
      onSubmit: params.onSubmit,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      targetContent: null,
      typeId: 1,
      entityId: 0,
      onSubmit: () => {},
    }),
}));
