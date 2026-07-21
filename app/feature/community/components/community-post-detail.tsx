"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Siren } from "lucide-react";
import { postDetailQueryOptions } from "../query-options";
import { deletePost } from "../api";
import { CommunityMarkdownViewer } from "./community-markdown-viewer";
import { CommunityLikeButtons } from "./community-like-buttons";
import { CommunityCommentSection } from "./community-comment-section";

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface CommunityPostDetailProps {
  postId: number;
}

export function CommunityPostDetail({ postId }: CommunityPostDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

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
        {/* 카테고리 배지 */}
        {post.category && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-[3px] text-[12px] font-semibold bg-black/5 text-black/80 mb-3">
            {post.boardCode === "FREE" ? "자유게시판" : "공연후기"}
          </span>
        )}

        {/* 제목 */}
        <h1 className="text-[20px] md:text-[26px] font-bold leading-[1.35] tracking-[-0.04em] text-black mb-4">
          {post.category && (
            <span className="text-black/50">[{post.category.name}] </span>
          )}
          {post.title}
        </h1>

        {/* 프로필 행: 아바타 + 닉네임 + 우측 버튼 */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <div className="flex items-center gap-2.5">
            {post.author.profilePath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.profilePath}
                alt={post.author.nickname}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-black/15 flex-shrink-0" />
            )}
            <p className="text-[14px] font-bold tracking-[-0.04em] text-black">
              {post.author.nickname}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {post.isMine && (
              <>
                <Link
                  href={`/community/${postId}/edit`}
                  className="flex items-center gap-1 text-[13px] font-semibold text-black/40 hover:text-black transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1 text-[13px] font-semibold text-black/40 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  삭제
                </button>
              </>
            )}
            <button
              onClick={() => alert("신고가 접수되었습니다.")}
              className="flex items-center gap-1 text-[13px] font-semibold text-black/40 hover:text-red-400 transition-colors"
            >
              <Siren className="w-3.5 h-3.5" />
              신고하기
            </button>
          </div>
        </div>

        {/* 날짜 - 구분선 아래 */}
        <p className="text-[12px] text-black/40 font-medium pt-3 mb-5">
          {formatDate(post.createdAt)}
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <span className="ml-2 text-black/30">(수정됨)</span>
          )}
        </p>

        {/* 본문 (마크다운) */}
        <div className="min-h-[120px] mb-6">
          <CommunityMarkdownViewer content={post.content} />
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

      {/* ── 우측 사이드바 ── */}
      <div className="hidden md:block w-[160px] xl:w-[180px] flex-shrink-0">
        <div className="sticky top-28">
          <Link
            href="/community/write"
            className="flex items-center justify-center w-full py-3.5 bg-main text-white text-[15px] font-bold leading-none tracking-[-0.04em] rounded-[4px] hover:opacity-90 transition-opacity"
          >
            글쓰기
          </Link>
        </div>
      </div>

    </div>
  );
}
