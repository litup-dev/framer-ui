"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Search, X } from "lucide-react";
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
import { cn, getImageUrl } from "@/lib/utils";
import { CommunityTagSearchModal, TAG_MODE_OPTIONS, formatDate, type TagMode } from "./community-tag-search-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  BoardCode,
  CategoryCode,
  ClubTag,
  PerformTag,
  TaggableClub,
  TaggablePerform,
} from "../types";

function clubTagToTaggable(tag: ClubTag): TaggableClub {
  return {
    id: tag.id,
    name: tag.name,
    address: tag.address,
    imageUrl: getImageUrl(tag.mainImage?.filePath),
  };
}

function performTagToTaggable(tag: PerformTag): TaggablePerform {
  return {
    id: tag.id,
    title: tag.title,
    artistLabel: tag.artists.map((a) => a.name).join(", "),
    performDate: tag.performDate,
    imageUrl: getImageUrl(tag.mainImage?.filePath),
  };
}

// "FAN"(팬 커뮤니티)은 아직 실제 게시판이 아니라 BoardCode에 없음 — 선택 불가 표시 전용.
type BoardOption =
  | { value: BoardCode; label: string; disabled?: false }
  | { value: "FAN"; label: string; disabled: true };

const BOARD_OPTIONS: BoardOption[] = [
  { value: "FREE", label: "자유게시판" },
  { value: "FAN", label: "팬 커뮤니티 (준비중)", disabled: true },
];

interface InitialValues {
  boardCode: BoardCode;
  categoryCode: CategoryCode | null;
  title: string;
  content: string;
  imageIds: number[];
  images: { id: number; filePath: string }[];
  clubTags: ClubTag[];
  performTags: PerformTag[];
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
  categoryCode: "GENERAL",
  title: "",
  content: "",
  imageIds: [],
  images: [],
  clubTags: [],
  performTags: [],
};

const CONTENT_CHAR_LIMIT = 50000;

// ProseMirror JSON 노드에서 텍스트만 재귀적으로 추출
function extractTextFromProseMirrorNode(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; content?: unknown[] };
  let text = "";
  if (typeof n.text === "string") text += n.text;
  if (Array.isArray(n.content)) {
    for (const child of n.content) text += extractTextFromProseMirrorNode(child);
  }
  return text;
}

// ProseMirror JSON 노드에서 image 노드의 src만 재귀적으로 추출 (문서에 실제로 남아있는 이미지 파악용)
function extractImageSrcs(node: unknown): string[] {
  if (!node || typeof node !== "object") return [];
  const n = node as { type?: string; attrs?: { src?: string }; content?: unknown[] };
  const srcs: string[] = [];
  if (n.type === "image" && n.attrs?.src) srcs.push(n.attrs.src);
  if (Array.isArray(n.content)) {
    for (const child of n.content) srcs.push(...extractImageSrcs(child));
  }
  return srcs;
}

// content 문자열(JSON 또는 raw)에서 plain text 추출
function extractInitialText(content: string | null | undefined): string {
  if (!content) return "";
  const trimmed = content.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return extractTextFromProseMirrorNode(JSON.parse(trimmed));
    } catch {
      return content;
    }
  }
  return content;
}

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
  // 본문 유효성 검사용: plain text (편집기가 emit).
  // 초기값도 initial.content에서 뽑아야 edit(draft) 진입 시 등록 버튼 활성화 판단이 맞음.
  const [contentText, setContentText] = useState(() =>
    extractInitialText(initial?.content),
  );
  const [imageIds, setImageIds] = useState<number[]>(
    initial?.imageIds ?? DEFAULT_INITIAL.imageIds,
  );
  // 클럽/공연 태그 (공연 후기 카테고리 전용). 칩 표시를 위해 id뿐 아니라 표시 정보도 함께 보관.
  const [selectedClubs, setSelectedClubs] = useState<TaggableClub[]>(() =>
    (initial?.clubTags ?? DEFAULT_INITIAL.clubTags).map(clubTagToTaggable),
  );
  const [selectedPerforms, setSelectedPerforms] = useState<TaggablePerform[]>(() =>
    (initial?.performTags ?? DEFAULT_INITIAL.performTags).map(performTagToTaggable),
  );
  const [isTagPanelOpen, setIsTagPanelOpen] = useState(false);
  const [tagPanelMode, setTagPanelMode] = useState<TagMode>("ALL");
  const [tagKeyword, setTagKeyword] = useState("");

  // 태그하기는 공연 후기 카테고리 전용 — 다른 카테고리로 바뀌면 선택된 태그를 비움
  useEffect(() => {
    if (categoryCode !== "PERFORM_REVIEW") {
      setSelectedClubs([]);
      setSelectedPerforms([]);
    }
  }, [categoryCode]);
  // 업로드된(또는 기존) 이미지의 url→id 매핑. 에디터 본문에 실제로 남아있는 이미지만
  // imageIds에 반영하기 위한 참조 테이블 — 에디터에서 이미지를 지우면 walk 시 자연히 빠짐.
  const imageUrlToIdRef = useRef<Map<string, number>>(
    new Map(
      (initial?.images ?? DEFAULT_INITIAL.images)
        .map((img) => [getImageUrl(img.filePath), img.id] as const)
        .filter((entry): entry is [string, number] => entry[0] !== null),
    ),
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
  // 마지막 저장 이후 변경이 있는지 (unmount 시 강제 저장 판단용)
  const dirtyRef = useRef(false);
  const isFirstDirtyRef = useRef(true);
  // 저장 직렬화 (동시 저장의 out-of-order arrival 방지)
  const isMutatingRef = useRef(false);
  const pendingSaveRef = useRef(false);

  // 임시저장 모드 판단: 새 폼이거나 draft 편집이면 true.
  // 마운트 시점에 고정 (publish 성공 후 상세 refetch로 isDraft가 false로 바뀌면서
  // 잠깐 "수정" 라벨이 보이는 문제 방지)
  const [isDraftFlow] = useState(
    () => mode === "create" || initialIsDraft,
  );

  const categoryOptions = CATEGORY_OPTIONS_BY_BOARD[boardCode] ?? [];

  const buildPayload = () => {
    // 편집기가 살아있으면 최신 상태 우선. 아니면 state의 content 사용.
    // (unmount 저장 시 editor가 먼저 destroy될 수 있음)
    let finalContent = content;
    try {
      const json = editorRef.current?.getJSON();
      if (json) finalContent = JSON.stringify(json);
    } catch {
      // 무시 - state fallback
    }
    return {
      categoryCode: categoryCode ?? undefined,
      title: title.trim(),
      content: finalContent,
      imageIds: Array.from(new Set(imageIds)),
      clubIds: selectedClubs.map((c) => c.id),
      performIds: selectedPerforms.map((p) => p.id),
    };
  };

  // ── 자동 임시저장 (silent) ──
  // 백엔드는 유저당 draft 1개만 허용 → createDraft 호출 시 기존 draft가 있으면 덮어씀.
  // imageIds는 매번 최종 상태 전체 전송 (부분 diff X). 동시 저장이 out-of-order로 도착하면
  // 오래된 payload가 최신을 덮어쓸 수 있어 이미지가 유실됨 → 직렬화 필수.
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
    onMutate: () => {
      isMutatingRef.current = true;
    },
    onSuccess: (res) => {
      if (!draftId) setDraftId(res.id);
      setLastSavedAt(Date.now());
      setAutoSaveError(false);
      dirtyRef.current = false;
      // drafts 목록만 refresh (posts 목록은 publish 시에만)
      queryClient.invalidateQueries({ queryKey: ["posts", "drafts"] });
      // 이 draft의 상세 캐시(postDetailQueryOptions)도 무효화 — 안 하면 같은 draft를
      // edit 페이지로 재방문 시 staleTime(60초) 내에는 방금 저장한 최신 내용 대신
      // 캐시된 이전 내용이 보임 (자동저장은 성공했지만 화면엔 반영 안 되는 버그)
      queryClient.invalidateQueries({ queryKey: ["posts", res.id] });
    },
    onError: () => {
      setAutoSaveError(true);
    },
    onSettled: () => {
      isMutatingRef.current = false;
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        // 진행 중일 때 요청됐던 저장 — 이제 최신 상태로 재발동
        saveDraft();
      }
    },
  });

  // 진행 중이면 큐잉, 아니면 즉시 발동 (out-of-order 방지)
  const triggerSave = () => {
    if (isMutatingRef.current) {
      pendingSaveRef.current = true;
      return;
    }
    saveDraft();
  };

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

  // ── dirty 트래킹 (unmount 시 강제 저장 판단용) ──
  // content(JSON)도 포함해야 이미지 리사이즈처럼 텍스트 변화 없이 attrs만 바뀌는 케이스 감지 가능
  useEffect(() => {
    if (isFirstDirtyRef.current) {
      isFirstDirtyRef.current = false;
      return;
    }
    dirtyRef.current = true;
  }, [title, content, contentText, imageIds, selectedClubs, selectedPerforms]);

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
      // 진행 중이면 pending 마킹, 완료 후 최신 상태로 재발동 (직렬화)
      triggerSave();
    }, 1500);

    return () => clearTimeout(timer);
    // saveDraft는 mutate 함수라 안정적. deps에서 제외.
    // content: 이미지 리사이즈처럼 텍스트 변화 없이 attrs만 바뀌는 케이스 감지용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    content,
    contentText,
    imageIds,
    selectedClubs,
    selectedPerforms,
    isDraftFlow,
    isOverLimit,
    isSubmitting,
  ]);

  // ── unmount 시 강제 저장 (debounce 대기 중이었으면 유실 방지) ──
  // cleanup은 마지막 render의 closure를 사용하므로 ref로 최신 상태 스냅샷 유지.
  const unmountSnapshotRef = useRef({
    title,
    contentText,
    imageIds,
    isDraftFlow,
  });
  useEffect(() => {
    unmountSnapshotRef.current = { title, contentText, imageIds, isDraftFlow };
  });
  useEffect(() => {
    return () => {
      if (!dirtyRef.current) return;
      const s = unmountSnapshotRef.current;
      if (!s.isDraftFlow) return;
      const hasSomething =
        s.title.trim().length > 0 ||
        s.contentText.trim().length > 0 ||
        s.imageIds.length > 0;
      if (!hasSomething) return;
      // fire-and-forget: React Query mutate는 컴포넌트 사라져도 fetch 유지
      triggerSave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {/* 임시저장: 자동저장과 별개로 즉시 저장을 트리거 */}
          {isDraftFlow && (
            <button
              type="button"
              onClick={triggerSave}
              disabled={isSavingDraft}
              className="px-3 xl:px-[18px] py-2 xl:py-[14px] text-[13px] xl:text-[16px] font-bold tracking-[-0.04em] rounded-[3px] border border-black/10 text-black/60 hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              임시저장
            </button>
          )}
          <button
            type="button"
            onClick={() => submit()}
            disabled={!canPublish}
            className={cn(
              "px-3 xl:px-[18px] py-2 xl:py-[14px] text-[13px] xl:text-[16px] font-bold tracking-[-0.04em] rounded-[3px] transition-opacity",
              canPublish
                ? "bg-main text-white hover:opacity-90 cursor-pointer"
                : "bg-main/50 text-white cursor-not-allowed",
            )}
          >
            {submitLabel}
          </button>
        </div>
      </div>

      {/* 게시판 + 카테고리 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <SelectField
          label="게시판"
          value={boardCode}
          onChange={() => {
            // 현재 실제로 선택 가능한 게시판은 자유게시판뿐이라 no-op
            // (팬 커뮤니티는 BOARD_OPTIONS에 disabled로만 노출)
          }}
          options={BOARD_OPTIONS}
        />
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
          className="w-full text-[16px] xl:text-[20px] font-semibold tracking-[-0.04em] text-black placeholder:text-black/20 bg-[#f8f8f8] outline-none rounded-[4px] p-4 xl:p-[24px]"
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
            // 본문에 실제로 남아있는 이미지 src만 골라 id로 변환 — 삭제된 이미지는 자연히 제외됨
            const idsInDoc = extractImageSrcs(json)
              .map((src) => imageUrlToIdRef.current.get(src))
              .filter((id): id is number => id !== undefined);
            setImageIds(Array.from(new Set(idsInDoc)));
          }}
          onImageUploaded={(id, url) => {
            imageUrlToIdRef.current.set(url, id);
          }}
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

      {/* 태그하기 (공연 후기 카테고리 전용) — 검색은 모달이 아니라 포스트 아래 인라인 검색창에서 */}
      {categoryCode === "PERFORM_REVIEW" && (
        <div className="mb-10">
          <p className="text-[13px] font-semibold text-black/60 mb-3">태그하기</p>

          <div className="relative flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden xl:flex flex-shrink-0 items-center justify-between gap-2 h-12 w-[148px] px-3.5 bg-[#f8f8f8] rounded-[4px] text-[16px] font-semibold text-black/80"
                >
                  <span># {TAG_MODE_OPTIONS.find((o) => o.value === tagPanelMode)?.label}</span>
                  <ChevronDown className="w-4 h-4 text-black/40 flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="z-[110]">
                {TAG_MODE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTagPanelMode(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1 md:flex-none md:w-[360px] flex items-center gap-2 h-12 px-3.5 bg-black/[0.03] rounded-[4px]">
              <input
                type="text"
                value={tagKeyword}
                onChange={(e) => {
                  const value = e.target.value;
                  setTagKeyword(value);
                  // 검색 시에만(검색어가 있을 때만) 결과 패널이 뜸 — 그냥 클릭/포커스만으로는 안 뜸
                  setIsTagPanelOpen(value.trim().length > 0);
                }}
                placeholder="검색어를 입력해 주세요."
                className="flex-1 min-w-0 bg-transparent text-[14px] text-black placeholder:text-black/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsTagPanelOpen(true)}
                aria-label="검색"
                className="flex-shrink-0 text-black/40 hover:text-black transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {isTagPanelOpen && (
              <CommunityTagSearchModal
                key={tagPanelMode}
                keyword={tagKeyword}
                onKeywordChange={setTagKeyword}
                mode={tagPanelMode}
                initialClubs={selectedClubs}
                initialPerforms={selectedPerforms}
                onClose={() => setIsTagPanelOpen(false)}
                onConfirm={(clubs, performs) => {
                  setSelectedClubs(clubs);
                  setSelectedPerforms(performs);
                  setIsTagPanelOpen(false);
                }}
              />
            )}
          </div>

          {(selectedClubs.length > 0 || selectedPerforms.length > 0) && (
            <div className="mt-3 flex flex-col sm:grid sm:grid-cols-2 gap-2">
              {selectedClubs.map((club) => (
                <TagChip
                  key={`club-${club.id}`}
                  imageUrl={club.imageUrl}
                  imageShape="circle"
                  title={club.name}
                  subtitle={club.address}
                  onRemove={() =>
                    setSelectedClubs((prev) => prev.filter((c) => c.id !== club.id))
                  }
                />
              ))}
              {selectedPerforms.map((perform) => (
                <TagChip
                  key={`perform-${perform.id}`}
                  imageUrl={perform.imageUrl}
                  imageShape="square"
                  title={perform.title}
                  subtitle={perform.artistLabel}
                  subtitle2={formatDate(perform.performDate)}
                  onRemove={() =>
                    setSelectedPerforms((prev) => prev.filter((p) => p.id !== perform.id))
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface TagChipProps {
  imageUrl: string | null;
  imageShape: "circle" | "square";
  title: string;
  subtitle: string;
  subtitle2?: string;
  onRemove: () => void;
}

function TagChip({ imageUrl, imageShape, title, subtitle, subtitle2, onRemove }: TagChipProps) {
  return (
    <div className="flex items-center gap-3 border border-[#d1d1d1] rounded-[4px] p-3">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className={cn(
            "flex-shrink-0 object-cover bg-black/10",
            imageShape === "circle" ? "w-10 h-10 rounded-full" : "w-9 h-11 rounded-[2px]",
          )}
        />
      ) : (
        <div
          className={cn(
            "flex-shrink-0 bg-black/10",
            imageShape === "circle" ? "w-10 h-10 rounded-full" : "w-9 h-11 rounded-[2px]",
          )}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-black truncate">{title}</p>
        <p className="text-[12px] text-black/60 truncate">{subtitle}</p>
        {subtitle2 && <p className="text-[12px] text-black/60 truncate">{subtitle2}</p>}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="태그 삭제"
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-black/40 hover:text-black transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
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
  const selectedLabel = options.find((o) => o.value === value)?.label;
  return (
    <div className="flex flex-col gap-4 border-b border-black/20 py-6">
      <label className="block text-[14px] font-bold tracking-[-0.04em] text-black/40">
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-between gap-2 text-[18px] font-semibold tracking-[-0.04em] text-black outline-none",
              "disabled:text-black/40 disabled:cursor-not-allowed",
            )}
          >
            <span>{selectedLabel}</span>
            <ChevronDown className="w-4 h-4 text-black/40 flex-shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="z-[110]">
          {options.map((o) => (
            <DropdownMenuItem key={o.value} disabled={o.disabled} onClick={() => onChange(o.value)}>
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
