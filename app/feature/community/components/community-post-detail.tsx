"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Pencil, Trash2, Siren } from "lucide-react";
import { postDetailQueryOptions } from "../query-options";
import { deletePost } from "../api";
import { CommunityMarkdownViewer } from "./community-markdown-viewer";
import { CommunityLikeButtons } from "./community-like-buttons";
import { CommunityCommentSection } from "./community-comment-section";
import { CommunityPostImageGallery } from "./community-post-image-gallery";
import { useLoginRequired } from "../hooks/use-login-required";
import { boardLabel } from "../constants";
import { getImageUrl } from "@/lib/utils";

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${String(d.getFullYear()).slice(2)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
    return (
      <div className="animate-pulse flex flex-col gap-5 py-8">
        <div className="h-4 w-16 bg-black/10 rounded" />
        <div className="h-8 w-3/4 bg-black/10 rounded" />
        <div className="h-4 w-40 bg-black/10 rounded" />
        <div className="h-px bg-black/10" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-black/5 rounded" style={{ width: `${75 + (i % 3) * 8}%` }} />
        ))}
      </div>
    );
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
        <span className="hidden xl:inline-flex items-center px-3 py-1.5 rounded-[3px] text-[12px] font-semibold bg-black/5 text-black/80 mb-3">
          {boardLabel(post.boardCode)}
        </span>

        {/* 제목 */}
        <h1 className="text-[20px] md:text-[22px] xl:text-[26px] font-bold leading-[1.35] tracking-[-0.04em] text-black mb-4 xl:mb-5">
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
          <p className="text-[14px] font-bold tracking-[-0.04em] text-black">
            {post.author.nickname}
          </p>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-black/10 mt-3" />

        {/* 날짜 + 우측 액션(수정/삭제/신고) */}
        <div className="flex items-center justify-between py-3 mb-5">
          <p className="text-[12px] text-black/40 font-medium">
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
                  className="flex items-center gap-1 text-[12px] font-semibold text-black/40 hover:text-black transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1 text-[12px] font-semibold text-black/40 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
                alert("신고가 접수되었습니다.");
              }}
              className="flex items-center gap-1 text-[12px] font-semibold text-black/40 hover:text-red-400 transition-colors"
            >
              <Siren className="w-3.5 h-3.5" />
              신고
            </button>
          </div>
        </div>

        {/* 본문 (마크다운) */}
        <div className="min-h-[120px] mb-6">
          <CommunityMarkdownViewer content={post.content} />
        </div>

        {/* 첨부 이미지 갤러리 */}
        {post.images?.length > 0 && (
          <div className="mb-6">
            <CommunityPostImageGallery images={post.images} />
          </div>
        )}

        {/* 태그된 클럽/공연 카드 자리 (API 반영 대기 - placeholder) */}
        <div className="mb-6 flex flex-col md:grid md:grid-cols-2 gap-3" aria-hidden="true">
          {/* 실제 데이터 연결 시 post.tags.clubs / post.tags.performances 로 렌더 */}
        </div>

        {/* 좋아요/싫어요/댓글/공유 */}
        <CommunityLikeButtons
          postId={postId}
          likeCount={post.likeCount}
          dislikeCount={post.dislikeCount}
          commentCount={post.commentCount}
          myLikeType={post.myLikeType}
        />

        {/* 댓글 섹션 */}
        <CommunityCommentSection postId={postId} commentCount={post.commentCount} />
      </article>

      {/* ── 우측 사이드바 (xl 이상) ── */}
      <div className="hidden xl:block w-[180px] flex-shrink-0">
        <div className="sticky top-28 flex flex-col gap-3">
          <Link
            href={isAuthenticated ? "/community/write" : "/login"}
            className="flex items-center justify-center w-full py-3.5 bg-main text-white text-[15px] font-bold leading-none tracking-[-0.04em] rounded-[4px] hover:opacity-90 transition-opacity"
          >
            글쓰기
          </Link>

          {/* 알림 카드 자리 (실제 알림 API 연동 예정) */}
          <div className="flex flex-col gap-2" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
