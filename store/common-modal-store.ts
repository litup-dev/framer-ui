import { create } from "zustand";

interface ButtonAction {
  label: string;
  onClick: () => void;
}

type TextAlign = "text-center" | "text-start";

interface CommonModalState {
  isOpen: boolean;
  description: string;
  textAlign: TextAlign;
  confirmButton: ButtonAction;
  cancelButton: ButtonAction;
  openModal: (params: {
    description: string;
    textAlign?: TextAlign;
    confirmButton: ButtonAction;
    cancelButton?: ButtonAction;
  }) => void;
  closeModal: () => void;
}

export const useCommonModalStore = create<CommonModalState>((set) => ({
  isOpen: false,
  description: "",
  textAlign: "text-center",
  confirmButton: { label: "확인", onClick: () => {} },
  cancelButton: { label: "취소", onClick: () => {} },
  openModal: (params) =>
    set({
      isOpen: true,
      description: params.description,
      textAlign: params.textAlign || "text-center",
      confirmButton: params.confirmButton,
      cancelButton: params.cancelButton || { label: "취소", onClick: () => {} },
    }),
  closeModal: () =>
    set({
      isOpen: false,
      description: "",
      textAlign: "text-center",
      confirmButton: { label: "확인", onClick: () => {} },
      cancelButton: { label: "취소", onClick: () => {} },
    }),
}));
