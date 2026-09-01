"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Pencil, Trash2, Siren } from "lucide-react";
import { postDetailQueryOptions } from "../query-options";
import { deletePost } from "../api";
import { CommunityHtmlViewer } from "./community-html-viewer";
import { CommunityLikeButtons } from "./community-like-buttons";
import { CommunityCommentSection } from "./community-comment-section";
import { useLoginRequired } from "../hooks/use-login-required";
import { boardLabel } from "../constants";
import { getImageUrl } from "@/lib/utils";

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${String(d.getFullYear()).slice(2)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ProseMirror JSON 노드에서 텍스트만 재귀적으로 추출 (공유하기 설명문용)
function extractPlainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; content?: unknown[] };
  let text = "";
  if (typeof n.text === "string") text += n.text;
  if (Array.isArray(n.content)) {
    for (const child of n.content) text += extractPlainText(child);
  }
  return text;
}

function extractShareDescription(content: string): string {
  const trimmed = content?.trim();
  if (!trimmed) return "";
  let text = trimmed;
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      text = extractPlainText(JSON.parse(trimmed));
    } catch {
      text = trimmed;
    }
  }
  return text.slice(0, 80);
}

interface CommunityPostDetailProps {
  postId: number;
}

export function CommunityPostDetail({ postId }: CommunityPostDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, showLoginModal } = useLoginRequired();

  const { data, isLoading, isError } = useQuery(postDetailQueryOptions(postId));
  const post = data?.data;

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/community");
    },
  });

  const handleDelete = () => {
    if (!confirm("게시글을 삭제할까요?")) return;
    remove();
  };

  if (isLoading) {
    return null;
  }

  if (isError || !post) {
    return (
      <div className="py-20 text-center">
        <p className="text-[15px] text-black/40">게시글을 불러올 수 없습니다.</p>
        <Link href="/community" className="mt-4 inline-block text-[13px] text-main underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-8 xl:gap-12 items-start w-full">
      {/* ── 본문 영역 ── */}
      <article className="flex-1 min-w-0">
        {/* 모바일/태블릿 서브 헤더: 뒤로가기 + 게시판명 (xl에서는 숨김) */}
        <div className="flex items-center relative mb-4 xl:hidden">
          <button
            onClick={() => router.back()}
            className="text-black flex-shrink-0"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <p className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold tracking-[-0.04em] text-black">
            {boardLabel(post.boardCode)}
          </p>
        </div>

        {/* 데스크탑 전용 게시판 배지 */}
        <span className="hidden xl:inline-flex items-center px-[14px] py-[10px] rounded-[3px] text-[14px] font-semibold bg-black/5 text-black/80 mb-3">
          {boardLabel(post.boardCode)}
        </span>

        {/* 제목 */}
        <h1 className="text-[20px] md:text-[22px] xl:text-[32px] font-bold leading-[1.35] tracking-[-0.04em] text-black mb-4 xl:mb-5">
          {post.category && (
            <span className="text-main">[{post.category.name}] </span>
          )}
          {post.title}
        </h1>

        {/* 프로필 행 (아바타 + 닉네임만) */}
        <div className="flex items-center gap-2.5">
          {(() => {
            const avatar = getImageUrl(post.author.profilePath);
            return avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={post.author.nickname}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <Image
                src="/images/user/user-avatar.svg"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            );
          })()}
          <p className="text-[14px] xl:text-[16px] font-bold tracking-[-0.04em] text-black">
            {post.author.nickname}
          </p>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-[#d1d1d1] mt-3" />

        {/* 날짜 + 우측 액션(수정/삭제/신고) */}
        <div className="flex items-center justify-between py-3 mb-5">
          <p className="text-[12px] xl:text-[14px] text-black/40 font-medium">
            <span>{formatDate(post.createdAt)} 작성</span>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <span className="ml-2">{formatDate(post.updatedAt)} 수정됨</span>
            )}
          </p>

          <div className="flex items-center gap-3">
            {post.isMine && (
              <>
                <Link
                  href={`/community/${postId}/edit`}
                  className="flex items-center gap-0.5 text-[12px] xl:text-[14px] font-semibold text-black/40 hover:text-black transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-0.5 text-[12px] xl:text-[14px] font-semibold text-black/40 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                  삭제
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  showLoginModal();
                  return;
                }
                alert("신고 기능은 준비 중입니다.");
              }}
              className="flex items-center gap-0.5 text-[12px] xl:text-[14px] font-semibold text-black/40 hover:text-red-400 transition-colors"
            >
              <Siren className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              신고
            </button>
          </div>
        </div>

        {/* 본문 (마크다운) */}
        <div className="min-h-[120px] mb-14 xl:mb-[72px]">
          <CommunityHtmlViewer content={post.content} />
        </div>

        {/* 태그된 클럽/공연 */}
        {/* clubTags/performTags는 백엔드 배포 전에는 응답에 아예 없을 수 있어 방어적으로 처리 */}
        {((post.clubTags?.length ?? 0) > 0 || (post.performTags?.length ?? 0) > 0) && (
          <div className="mb-6 flex flex-col md:grid md:grid-cols-2 2xl:grid-cols-1 gap-2">
            {(post.clubTags ?? []).map((club) => (
              <Link
                key={`club-${club.id}`}
                href={`/club/${club.id}`}
                className="flex items-center gap-3 border border-[#d1d1d1] rounded-[4px] p-4 hover:border-black/30 transition-colors"
              >
                {(() => {
                  const url = getImageUrl(club.mainImage?.filePath);
                  return url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="" className="w-14 h-14 rounded-full object-cover flex-shrink-0 bg-black/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-full flex-shrink-0 bg-black/10" />
                  );
                })()}
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold tracking-[-0.04em] text-black truncate">{club.name}</p>
                  <p className="text-[14px] font-medium text-black/80 truncate">{club.address}</p>
                </div>
              </Link>
            ))}
            {(post.performTags ?? []).map((perform) => (
              <Link
                key={`perform-${perform.id}`}
                href={`/performance/${perform.id}`}
                className="flex items-center gap-4 border border-[#d1d1d1] rounded-[4px] p-4 hover:border-black/30 transition-colors"
              >
                {(() => {
                  const url = getImageUrl(perform.mainImage?.filePath);
                  return url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="" className="w-[52px] h-[65px] rounded-[2px] object-cover flex-shrink-0 bg-black/10" />
                  ) : (
                    <div className="w-[52px] h-[65px] rounded-[2px] flex-shrink-0 bg-black/10" />
                  );
                })()}
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold tracking-[-0.04em] text-black truncate">{perform.title}</p>
                  <p className="text-[14px] font-medium text-black/80 truncate">
                    {perform.artists.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-[14px] font-medium text-black/60 truncate">{formatDate(perform.performDate)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 좋아요/싫어요/댓글/공유 */}
        <CommunityLikeButtons
          postId={postId}
          likeCount={post.likeCount}
          dislikeCount={post.dislikeCount}
          commentCount={post.commentCount}
          myLikeType={post.myLikeType}
          postTitle={post.title}
          authorNickname={post.author.nickname}
          description={extractShareDescription(post.content)}
          imageFilePath={post.images[0]?.filePath ?? null}
        />

        {/* 댓글 섹션 */}
        <CommunityCommentSection postId={postId} commentCount={post.commentCount} />
      </article>

      {/* ── 우측 사이드바 (2xl 이상 — 1280에서는 노출 안 함) ── */}
      <div className="hidden 2xl:block w-[180px] flex-shrink-0">
        {/* 게시판 배지와 같은 크기의 투명 스페이서 — 글쓰기 버튼을 배지 줄이 아니라 제목 줄에 맞춤 */}
        <span
          aria-hidden="true"
          className="invisible inline-flex items-center px-[14px] py-[10px] rounded-[3px] text-[14px] font-semibold mb-3"
        >
          {boardLabel(post.boardCode)}
        </span>
        <div className="sticky top-28 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                showLoginModal();
                return;
              }
              router.push("/community/write");
            }}
            className="flex items-center justify-center w-full py-3.5 bg-main text-white text-[15px] font-bold leading-none tracking-[-0.04em] rounded-[4px] hover:opacity-90 transition-opacity cursor-pointer"
          >
            {isAuthenticated ? "글쓰기" : "로그인 후 글 작성하기"}
          </button>

          {/* 알림 카드 자리 (실제 알림 API 연동 예정) */}
          <div className="flex flex-col gap-2" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
