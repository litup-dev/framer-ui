"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { ApiError } from "@/lib/api-client";
import { CATEGORY_OPTIONS_BY_BOARD } from "../constants";
import {
  CommunityTiptapEditor,
  type CommunityTiptapEditorRef,
} from "./community-tiptap-editor";
import { CommunityLoadingOverlay } from "./community-loading-overlay";
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
  existingDraftId?: number | null; // create 모드에서 최근 draft가 있을 때 이어쓰기 유도
}

const DEFAULT_INITIAL: InitialValues = {
  boardCode: "FREE",
  categoryCode: null,
  title: "",
  content: "",
  imageIds: [],
};

const CONTENT_CHAR_LIMIT = 50000;

// 백엔드 응답 상황별 사용자 친화 메시지
function formatSaveError(err: unknown, action: string): string {
  if (err instanceof ApiError) {
    // 백엔드 message가 있으면 우선 사용
    if (err.message && !err.message.startsWith("API 요청")) return err.message;
    if (err.status === 413) return `${action}할 내용이 너무 큽니다. 이미지 개수나 본문 길이를 줄여주세요.`;
    if (err.status === 400) return `${action} 요청이 유효하지 않습니다. 제목/카테고리/본문을 확인해주세요.`;
    if (err.status >= 500) return `서버에 일시적인 문제가 있어 ${action}에 실패했습니다. 잠시 후 다시 시도해주세요.`;
  }
  return `${action}에 실패했습니다. 잠시 후 다시 시도해주세요.`;
}

export function CommunityPostForm({
  mode,
  postId,
  initial,
  initialIsDraft = false,
  existingDraftId = null,
}: CommunityPostFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorRef = useRef<CommunityTiptapEditorRef>(null);

  const boardCode: BoardCode = initial?.boardCode ?? DEFAULT_INITIAL.boardCode;
  const [categoryCode, setCategoryCode] = useState<CategoryCode | null>(
    initial?.categoryCode ?? DEFAULT_INITIAL.categoryCode,
  );
  const [title, setTitle] = useState(initial?.title ?? DEFAULT_INITIAL.title);
  // content: Tiptap JSON을 stringify한 문자열 (백엔드 저장 포맷과 동일)
  const [content, setContent] = useState(
    initial?.content ?? DEFAULT_INITIAL.content,
  );
  // 본문 유효성 검사용: plain text (편집기가 emit)
  const [contentText, setContentText] = useState("");
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

  // 자동 저장 상태 표시용
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [autoSaveError, setAutoSaveError] = useState(false);
  const isFirstEditRef = useRef(true);

  // 임시저장 모드 판단: 새 폼이거나 draft 편집이면 true
  const isDraftFlow = mode === "create" || initialIsDraft;

  const categoryOptions = CATEGORY_OPTIONS_BY_BOARD[boardCode] ?? [];

  const buildPayload = () => {
    // 편집기가 최신 상태이면 그걸 우선 사용
    const json = editorRef.current?.getJSON();
    const finalContent = json ? JSON.stringify(json) : content;
    return {
      categoryCode: categoryCode ?? undefined,
      title: title.trim(),
      content: finalContent,
      imageIds: Array.from(new Set(imageIds)),
    };
  };

  // ── 자동 임시저장 (silent) ──
  // 백엔드는 유저당 draft 1개만 허용 → createDraft 호출 시 기존 draft가 있으면 덮어씀.
  const { mutate: saveDraft, isPending: isSavingDraft } = useMutation({
    mutationFn: async () => {
      const payload = buildPayload();
      if (draftId) {
        await updateDraft(draftId, payload);
        return { id: draftId };
      }
      const res = await createDraft({ boardCode, ...payload });
      return { id: res.data.id };
    },
    onSuccess: (res) => {
      if (!draftId) setDraftId(res.id);
      setLastSavedAt(Date.now());
      setAutoSaveError(false);
      // drafts 목록만 refresh (posts 목록은 publish 시에만)
      queryClient.invalidateQueries({ queryKey: ["posts", "drafts"] });
    },
    onError: () => {
      setAutoSaveError(true);
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
    onError: (err) => {
      alert(formatSaveError(err, mode === "edit" ? "수정" : "등록"));
    },
  });

  const contentLength = contentText.length;
  const isOverLimit = contentLength > CONTENT_CHAR_LIMIT;

  const canPublish = useMemo(() => {
    if (!title.trim()) return false;
    if (!categoryCode) return false;
    const hasContent = contentText.trim().length > 0 || imageIds.length > 0;
    if (!hasContent) return false;
    if (isOverLimit) return false;
    return !isSubmitting;
  }, [title, categoryCode, contentText, imageIds, isSubmitting, isOverLimit]);

  // ── 자동 저장 (debounce 1.5초) ──
  // categoryCode는 백엔드가 기본값(GENERAL)을 자동 세팅하므로 조건 검사 안 함.
  useEffect(() => {
    if (!isDraftFlow) return;
    // 최초 마운트/초기 로드 시엔 저장 안 함
    if (isFirstEditRef.current) {
      isFirstEditRef.current = false;
      return;
    }
    if (isOverLimit) return;
    if (isSubmitting) return; // 게시 진행 중이면 skip

    // 진짜 내용 있을 때만
    const hasSomething =
      title.trim().length > 0 ||
      contentText.trim().length > 0 ||
      imageIds.length > 0;
    if (!hasSomething) return;

    const timer = setTimeout(() => {
      // 저장 중이어도 그냥 호출 — 백엔드가 upsert(유저당 1 draft) 라서
      // 동시 호출도 마지막 값으로 수렴. 스킵하면 이미지만 추가한 케이스가 유실됨.
      saveDraft();
    }, 1500);

    return () => clearTimeout(timer);
    // saveDraft는 mutate 함수라 안정적. deps에서 제외.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, contentText, imageIds, isDraftFlow, isOverLimit, isSubmitting]);

  // "방금 저장됨" 표시를 일정 시간 후 페이드아웃 (기본 문구로 복귀)
  useEffect(() => {
    if (!lastSavedAt) return;
    const t = setTimeout(() => setLastSavedAt(null), 3000);
    return () => clearTimeout(t);
  }, [lastSavedAt]);

  const handleCancel = () => {
    if (
      contentText.trim() ||
      title.trim() ||
      (mode === "create" && imageIds.length > 0)
    ) {
      if (!confirm("작성 중인 내용이 사라집니다. 취소할까요?")) return;
    }
    router.back();
  };

  const submitLabel =
    mode === "edit" && !isDraftFlow ? "수정" : "등록";

  // 등록/수정 진행 시에만 오버레이 (자동저장은 조용히)
  const overlayLabel = isSubmitting
    ? mode === "edit" && !isDraftFlow
      ? "수정 중..."
      : "등록 중..."
    : "";

  // 자동저장 상태 표시 문구
  const draftStatusText = isDraftFlow
    ? isSavingDraft
      ? "저장 중입니다..."
      : autoSaveError
        ? "저장에 실패했습니다"
        : lastSavedAt
          ? "방금 저장되었습니다"
          : "자동으로 임시 저장됩니다"
    : "";

  return (
    <div className="w-full flex flex-col">
      <CommunityLoadingOverlay show={isSubmitting} label={overlayLabel} />
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

        <div className="flex items-center gap-3">
          {/* 이어쓰기 버튼: create 모드 + 기존 draft 있고 이번 세션에서 아직 저장 안 함 */}
          {mode === "create" && existingDraftId && draftId === null && (
            <button
              type="button"
              onClick={() => router.push(`/community/${existingDraftId}/edit`)}
              className="px-3 xl:px-4 py-2 text-[12px] xl:text-[13px] font-semibold rounded-[4px] border border-main text-main hover:bg-main/5 transition-colors cursor-pointer"
            >
              임시저장한 글을 이어씁니다
            </button>
          )}
          {/* 자동 임시저장 상태 표시 */}
          {isDraftFlow && (
            <span
              className={cn(
                "text-[12px] font-medium hidden sm:inline",
                autoSaveError ? "text-red-500" : "text-black/40",
              )}
              aria-live="polite"
            >
              {draftStatusText}
            </span>
          )}
          <button
            type="button"
            onClick={() => submit()}
            disabled={!canPublish}
            className={cn(
              "px-4 py-2 text-[14px] font-bold rounded-[4px] transition-opacity",
              canPublish
                ? "bg-main text-white hover:opacity-90 cursor-pointer"
                : "bg-main/50 text-white cursor-not-allowed",
            )}
          >
            {submitLabel}
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

      {/* Tiptap Editor */}
      <div className="mb-2">
        <CommunityTiptapEditor
          ref={editorRef}
          initialContent={initial?.content}
          onChange={(json, text) => {
            setContent(JSON.stringify(json));
            setContentText(text);
          }}
          onImageUploaded={(id) => setImageIds((prev) => [...prev, id])}
          minHeight="400px"
          characterLimit={CONTENT_CHAR_LIMIT}
        />
      </div>
      <div className="flex items-center justify-end mb-8">
        <span
          className={cn(
            "text-[12px] font-medium tabular-nums",
            isOverLimit ? "text-red-500" : "text-black/40",
          )}
        >
          {contentLength.toLocaleString()} / {CONTENT_CHAR_LIMIT.toLocaleString()}자
        </span>
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
