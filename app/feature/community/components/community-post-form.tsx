"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import {
  createPost,
  updatePost,
  createDraft,
  updateDraft,
  publishDraft,
} from "../api";
import { CATEGORY_OPTIONS_BY_BOARD } from "../constants";
import {
  CommunityToastEditor,
  type CommunityToastEditorRef,
} from "./community-toast-editor";
import { cn } from "@/lib/utils";
import type { BoardCode, CategoryCode } from "../types";

interface InitialValues {
  boardCode: BoardCode;
  categoryCode: CategoryCode | null;
  title: string;
  content: string;
  imageIds: number[];
}

interface CommunityPostFormProps {
  mode: "create" | "edit";
  postId?: number;
  initial?: Partial<InitialValues>;
  initialIsDraft?: boolean; // edit 진입 시 이 글이 draft인지
}

const DEFAULT_INITIAL: InitialValues = {
  boardCode: "FREE",
  categoryCode: null,
  title: "",
  content: "",
  imageIds: [],
};

export function CommunityPostForm({
  mode,
  postId,
  initial,
  initialIsDraft = false,
}: CommunityPostFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorRef = useRef<CommunityToastEditorRef>(null);

  const boardCode: BoardCode = initial?.boardCode ?? DEFAULT_INITIAL.boardCode;
  const [categoryCode, setCategoryCode] = useState<CategoryCode | null>(
    initial?.categoryCode ?? DEFAULT_INITIAL.categoryCode,
  );
  const [title, setTitle] = useState(initial?.title ?? DEFAULT_INITIAL.title);
  const [content, setContent] = useState(
    initial?.content ?? DEFAULT_INITIAL.content,
  );
  const [imageIds, setImageIds] = useState<number[]>(
    initial?.imageIds ?? DEFAULT_INITIAL.imageIds,
  );

  // draft ID:
  //   - create + 아직 임시저장 안 함 → null
  //   - create + 임시저장 후 → 서버가 준 id
  //   - edit(draft) → 처음부터 postId
  const [draftId, setDraftId] = useState<number | null>(
    mode === "edit" && initialIsDraft && postId ? postId : null,
  );

  // 임시저장 모드 판단: 새 폼이거나 draft 편집이면 true
  const isDraftFlow = mode === "create" || initialIsDraft;

  const categoryOptions = CATEGORY_OPTIONS_BY_BOARD[boardCode] ?? [];

  const buildPayload = () => {
    const finalContent = editorRef.current?.getMarkdown() ?? content;
    return {
      categoryCode: categoryCode ?? undefined,
      title: title.trim(),
      content: finalContent,
      imageIds: Array.from(new Set(imageIds)),
    };
  };

  // ── 임시저장 (create draft or update draft) ──
  const { mutate: saveDraft, isPending: isSavingDraft } = useMutation({
    mutationFn: async () => {
      const payload = buildPayload();
      if (draftId) {
        return updateDraft(draftId, payload);
      }
      return createDraft({ boardCode, ...payload });
    },
    onSuccess: (res) => {
      if (!draftId) setDraftId(res.data.id);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      alert("임시저장에 실패했습니다.");
    },
  });

  // ── 등록/수정 (publish or update post or create) ──
  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      const payload = buildPayload();

      if (draftId) {
        // draft를 최신 상태로 저장 후 publish
        await updateDraft(draftId, payload);
        return publishDraft(draftId);
      }
      if (mode === "edit" && postId) {
        return updatePost(postId, payload);
      }
      return createPost({ boardCode, ...payload });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      const id = mode === "edit" && !draftId ? postId : res.data.id;
      router.replace(`/community/${id}`);
    },
    onError: () => {
      alert("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    },
  });

  const canPublish = useMemo(() => {
    if (!title.trim()) return false;
    if (!categoryCode) return false;
    if (!content.trim()) return false;
    return !isSubmitting;
  }, [title, categoryCode, content, isSubmitting]);

  const canSaveDraft = useMemo(() => {
    if (!categoryCode) return false;
    return !isSavingDraft && isDraftFlow;
  }, [categoryCode, isSavingDraft, isDraftFlow]);

  const handleCancel = () => {
    if (
      content.trim() ||
      title.trim() ||
      (mode === "create" && imageIds.length > 0)
    ) {
      if (!confirm("작성 중인 내용이 사라집니다. 취소할까요?")) return;
    }
    router.back();
  };

  const submitLabel =
    mode === "edit" && !isDraftFlow ? "수정" : "등록";

  return (
    <div className="w-full flex flex-col">
      {/* 헤더 (반응형) */}
      <div className="flex items-center justify-between border-b border-black/10 pb-3 xl:pb-5 mb-6 xl:mb-8">
        <button
          type="button"
          onClick={handleCancel}
          className="xl:hidden text-[15px] font-semibold text-black"
        >
          취소
        </button>
        <h1 className="hidden xl:block text-[24px] font-bold tracking-[-0.04em] text-black">
          {mode === "edit" && !isDraftFlow
            ? "커뮤니티 수정"
            : "커뮤니티 글쓰기"}
        </h1>

        <div className="flex items-center gap-2">
          {isDraftFlow && (
            <button
              type="button"
              onClick={() => saveDraft()}
              disabled={!canSaveDraft}
              className={cn(
                "px-4 py-2 text-[14px] font-semibold rounded-[4px] border transition-opacity",
                canSaveDraft
                  ? "border-black/20 text-black hover:bg-black/5"
                  : "border-black/10 text-black/40 cursor-not-allowed",
              )}
            >
              {isSavingDraft ? "저장 중..." : "임시저장"}
            </button>
          )}
          <button
            type="button"
            onClick={() => submit()}
            disabled={!canPublish}
            className={cn(
              "px-4 py-2 text-[14px] font-bold rounded-[4px] transition-opacity",
              canPublish
                ? "bg-main text-white hover:opacity-90"
                : "bg-main/50 text-white cursor-not-allowed",
            )}
          >
            {isSubmitting ? "저장 중..." : submitLabel}
          </button>
        </div>
      </div>

      {/* 카테고리 (게시판은 현재 FREE 단일이라 UI 생략) */}
      <div className="mb-6">
        <SelectField
          label="카테고리"
          value={categoryCode ?? ""}
          onChange={(v) => setCategoryCode(v as CategoryCode)}
          options={[
            { value: "", label: "선택해 주세요", disabled: true },
            ...categoryOptions.map((o) => ({
              value: o.code,
              label: o.label,
            })),
          ]}
        />
      </div>

      {/* 제목 */}
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해 주세요."
          maxLength={100}
          className="w-full text-[16px] xl:text-[18px] font-medium tracking-[-0.04em] text-black placeholder:text-black/30 bg-transparent outline-none pb-3 border-b border-black/10"
        />
      </div>

      {/* Toast Editor */}
      <div className="mb-8">
        <CommunityToastEditor
          initialValue={initial?.content}
          onChange={setContent}
          onImageUploaded={(id) => setImageIds((prev) => [...prev, id])}
          height="500px"
        />
      </div>

      {/* 태그하기 (자리만 - 백엔드 구현 후 활성화) */}
      <div className="mb-10">
        <p className="text-[13px] font-semibold text-black/60 mb-3">태그하기</p>
        <div className="flex items-center gap-2 border-b border-black/10 pb-3">
          <span className="flex-shrink-0 text-[13px] text-black/40 hidden xl:inline">
            # 클럽
          </span>
          <input
            type="text"
            disabled
            placeholder="검색어를 입력해 주세요. (곧 지원 예정)"
            className="flex-1 text-[14px] text-black placeholder:text-black/30 bg-transparent outline-none disabled:cursor-not-allowed"
          />
          <ChevronDown className="w-4 h-4 text-black/30" />
        </div>
      </div>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-black/60 mb-2">
        {label}
      </label>
      <div className="relative border-b border-black/10">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none bg-transparent text-[15px] font-medium text-black outline-none pr-6 py-2",
            "disabled:text-black/40 disabled:cursor-not-allowed",
          )}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 pointer-events-none" />
      </div>
    </div>
  );
}
