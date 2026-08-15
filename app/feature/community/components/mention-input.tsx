"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import type { MentionableUser } from "../types";

const MENTION_TOKEN_RE = /@\[([^\]]+)\]\((\d+)\)/g;

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentionedUserIds: number[]) => void;
  mentionableUsers: MentionableUser[];
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  ariaLabel?: string;
}

interface SerializeResult {
  text: string;
  ids: number[];
}

function walk(node: Node, out: SerializeResult) {
  if (node.nodeType === Node.TEXT_NODE) {
    out.text += node.textContent ?? "";
    return;
  }
  if (!(node instanceof HTMLElement)) return;

  if (node.dataset.mention === "true") {
    const nick = node.dataset.nickname ?? "";
    const id = Number(node.dataset.userId ?? 0);
    out.text += `@[${nick}](${id})`;
    if (id) out.ids.push(id);
    return;
  }
  if (node.tagName === "BR") {
    out.text += "\n";
    return;
  }
  if (node.tagName === "DIV" && out.text && !out.text.endsWith("\n")) {
    out.text += "\n";
  }
  node.childNodes.forEach((c) => walk(c, out));
}

function serializeDOM(root: HTMLElement): SerializeResult {
  const out: SerializeResult = { text: "", ids: [] };
  root.childNodes.forEach((c) => walk(c, out));
  if (out.text.endsWith("\n")) out.text = out.text.slice(0, -1);
  return out;
}

function escapeHTML(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToHTML(text: string): string {
  let html = "";
  let last = 0;
  MENTION_TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MENTION_TOKEN_RE.exec(text)) !== null) {
    html += escapeHTML(text.slice(last, m.index)).replace(/\n/g, "<br>");
    const nick = escapeHTML(m[1]);
    const id = m[2];
    html += `<span data-mention="true" data-user-id="${id}" data-nickname="${nick}" contenteditable="false" class="text-main font-semibold">@${nick}</span>`;
    last = m.index + m[0].length;
  }
  html += escapeHTML(text.slice(last)).replace(/\n/g, "<br>");
  return html;
}

export function MentionInput({
  value,
  onChange,
  mentionableUsers,
  placeholder,
  className,
  onFocus,
  ariaLabel,
}: MentionInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // 빈 문자열로 시작 — 마운트 시 value(수정/답글 프리필 등)가 있으면 DOM에 반드시 반영되도록 함
  const lastEmittedRef = useRef<string>("");
  const composingRef = useRef(false);

  const [query, setQuery] = useState<string | null>(null);
  const [queryPos, setQueryPos] = useState<{ node: Text; start: number; end: number } | null>(null);

  // 외부 value → DOM 동기화 (내가 방금 emit한 값이 아닐 때만)
  useEffect(() => {
    if (!editorRef.current) return;
    if (value !== lastEmittedRef.current) {
      editorRef.current.innerHTML = textToHTML(value);
      lastEmittedRef.current = value;
    }
  }, [value]);

  const filteredUsers = useMemo(() => {
    if (query === null) return [];
    const q = query.toLowerCase();
    return mentionableUsers
      .filter((u) => u.nickname.toLowerCase().includes(q))
      .slice(0, 20);
  }, [query, mentionableUsers]);

  const emit = useCallback(() => {
    if (!editorRef.current) return;
    const { text, ids } = serializeDOM(editorRef.current);
    lastEmittedRef.current = text;
    onChange(text, ids);
  }, [onChange]);

  const detectMention = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || !sel.isCollapsed || !editorRef.current) {
      setQuery(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!editorRef.current.contains(range.startContainer)) {
      setQuery(null);
      return;
    }
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) {
      setQuery(null);
      return;
    }
    const text = node.textContent ?? "";
    const caret = range.startOffset;
    let i = caret - 1;
    while (i >= 0) {
      const ch = text[i];
      if (ch === "@") {
        const prev = i > 0 ? text[i - 1] : null;
        const validStart = prev === null || prev === " " || prev === "\n" || prev === " ";
        if (!validStart) {
          setQuery(null);
          return;
        }
        const q = text.slice(i + 1, caret);
        if (/\s/.test(q)) {
          setQuery(null);
          return;
        }
        setQuery(q);
        setQueryPos({ node: node as Text, start: i, end: caret });
        return;
      }
      if (ch === " " || ch === "\n" || ch === " ") {
        setQuery(null);
        return;
      }
      i--;
    }
    setQuery(null);
  }, []);

  const handleInput = () => {
    if (composingRef.current) return;
    emit();
    detectMention();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (composingRef.current) return;

    // ESC → 드롭다운 닫기
    if (e.key === "Escape" && query !== null) {
      e.preventDefault();
      setQuery(null);
      return;
    }

    if (e.key === "Backspace") {
      const sel = window.getSelection();
      if (!sel || !sel.isCollapsed) return;
      const range = sel.getRangeAt(0);

      // 케이스 1: 텍스트 노드 시작(offset 0)에서 백스페이스 → 이전 형제가 mention span이면 통째로 삭제
      if (
        range.startOffset === 0 &&
        range.startContainer.nodeType === Node.TEXT_NODE
      ) {
        const prev = range.startContainer.previousSibling;
        if (prev instanceof HTMLElement && prev.dataset.mention === "true") {
          e.preventDefault();
          prev.remove();
          emit();
          setQuery(null);
          return;
        }
      }

      // 케이스 2: 커서가 editor 컨테이너 자체에 있고 바로 앞이 mention span
      if (
        range.startContainer === editorRef.current &&
        range.startOffset > 0
      ) {
        const node = editorRef.current!.childNodes[range.startOffset - 1];
        if (node instanceof HTMLElement && node.dataset.mention === "true") {
          e.preventDefault();
          node.remove();
          emit();
          setQuery(null);
          return;
        }
      }
    }
  };

  const insertMention = (user: MentionableUser) => {
    if (!queryPos || !editorRef.current) return;
    const { node, start, end } = queryPos;

    // @query 텍스트 잘라내기
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    range.deleteContents();

    // mention span 생성
    const span = document.createElement("span");
    span.dataset.mention = "true";
    span.dataset.userId = String(user.id);
    span.dataset.nickname = user.nickname;
    span.contentEditable = "false";
    span.className = "text-main font-semibold";
    span.textContent = `@${user.nickname}`;

    // 뒤에 공백
    const trailingSpace = document.createTextNode(" ");

    range.insertNode(trailingSpace);
    range.insertNode(span);

    // 커서를 공백 뒤로
    const sel = window.getSelection();
    if (sel) {
      const r = document.createRange();
      r.setStart(trailingSpace, 1);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    }

    setQuery(null);
    setQueryPos(null);
    emit();
    editorRef.current.focus();
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };
  const handleCompositionEnd = () => {
    composingRef.current = false;
    emit();
    detectMention();
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={ariaLabel}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        data-placeholder={placeholder}
        className={cn(
          "outline-none whitespace-pre-wrap break-words",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-black/30 empty:before:pointer-events-none",
          className,
        )}
      />
      {query !== null && filteredUsers.length > 0 && (
        <MentionDropdown users={filteredUsers} onSelect={insertMention} />
      )}
    </div>
  );
}

interface DropdownProps {
  users: MentionableUser[];
  onSelect: (user: MentionableUser) => void;
}

function MentionDropdown({ users, onSelect }: DropdownProps) {
  return (
    <div className="absolute left-0 bottom-full mb-1 w-max min-w-[140px] max-w-[240px] max-h-[220px] overflow-y-auto bg-white border border-black/10 rounded-[6px] shadow-lg z-40">
      {users.map((u) => {
        const avatar = getImageUrl(u.profilePath);
        return (
          <button
            key={u.id}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault(); // 에디터 blur 방지
              onSelect(u);
            }}
            className="flex items-center gap-2.5 w-full px-3.5 py-3 text-left hover:bg-black/5 transition-colors border-b border-black/[0.06] last:border-0"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <Image
                src="/images/user/user-avatar.svg"
                alt=""
                width={28}
                height={28}
                className="w-7 h-7 rounded-full flex-shrink-0"
              />
            )}
            <span className="min-w-0 truncate text-[14px] font-semibold text-black">
              {u.nickname}
            </span>
            {u.isAuthor && (
              <span className="ml-1 flex-shrink-0 text-[11px] font-semibold text-main">작성자</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
