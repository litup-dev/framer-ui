"use client";

import { useState, useEffect } from "react";
import { Siren } from "lucide-react";
import { Subtitle, Description } from "@/components/shared/typography";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { REPORT_CATEGORIES } from "@/app/shared/constants";
import { useReportModalStore } from "@/store/report-modal-store";

const DESCRIPTION_MAX_LENGTH = 500;

export const ReportModal = () => {
  const { isOpen, targetContent, onSubmit, closeModal } =
    useReportModalStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory("");
      setDescription("");
    }
  }, [isOpen]);

  const handleSubmit = (): void => {
    if (!selectedCategory) return;
    onSubmit(selectedCategory, description);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className="w-[353px] max-h-[640px] md:w-[495px] md:max-h-[640px] p-0 rounded-[8px] overflow-y-auto overflow-x-hidden"
        showCloseButton={false}
      >
        <div className="px-5 pt-6 pb-6 md:px-12 md:pt-11 md:pb-11">
          <DialogHeader className="mb-8">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Siren className="w-5 h-5" />
                <Subtitle className="text-[18px] md:text-[20px]">
                  신고하기
                </Subtitle>
              </DialogTitle>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center transition-colors text-black-60 hover:text-black"
                aria-label="닫기"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </DialogHeader>

          <div className="mb-5 md:mb-6">{targetContent}</div>

          <div className="mb-5 md:mb-10 space-y-5 md:space-y-6">
            {REPORT_CATEGORIES.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="report-category"
                  value={category.id}
                  checked={selectedCategory === category.id}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-main checked:border-[6px] transition-all cursor-pointer align-text-bottom"
                />
                <Description className="text-[14px] md:text-[16px]">
                  {category.label}
                </Description>
              </label>
            ))}
          </div>

          <div className="mb-5 md:mb-10">
            <Textarea
              placeholder="내용을 입력해주세요"
              className="w-[313px] md:w-[399px] h-[144px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!selectedCategory}
              className="w-[60px] h-[38px] md:w-16 md:h-11 bg-foreground text-background hover:bg-foreground/90"
            >
              <Subtitle className="text-[14px] md:text-[16px]">제출</Subtitle>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
