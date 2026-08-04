"use client";

import { useEffect, useImperativeHandle, forwardRef, useState, useRef } from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { uploadPostImage } from "../api";
import { getImageUrl, cn } from "@/lib/utils";

export interface CommunityTiptapEditorRef {
  getJSON: () => object;
  getText: () => string;
  setContent: (content: object | string) => void;
  focus: () => void;
}

interface CommunityTiptapEditorProps {
  // JSON 객체 (Tiptap doc) 또는 JSON 문자열 (백엔드 저장값). 빈 값이면 빈 doc으로 시작.
  initialContent?: object | string | null;
  onChange?: (json: object, text: string) => void;
  onImageUploaded?: (imageId: number) => void;
  placeholder?: string;
  minHeight?: string;
  characterLimit?: number;
}

function parseInitial(input?: object | string | null): object | string {
  if (!input) return "";
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed);
      } catch {
        // JSON 파싱 실패 시 raw string 그대로 (구 데이터 fallback)
        return input;
      }
    }
    return input;
  }
  return input;
}

// ── 리사이즈 가능한 Image NodeView ──
function ResizableImageComponent({ node, updateAttributes, selected }: NodeViewProps) {
  const [resizing, setResizing] = useState(false);
  const width = (node.attrs.width as number | null) ?? null;

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const imgEl = (e.currentTarget.parentElement?.querySelector("img") as HTMLImageElement | null);
    if (!imgEl) return;
    const startWidth = imgEl.getBoundingClientRect().width;
    setResizing(true);

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const newWidth = Math.max(80, Math.round(startWidth + delta));
      updateAttributes({ width: newWidth });
    };
    const onUp = () => {
      setResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <NodeViewWrapper
      className={cn(
        "relative inline-block max-w-full my-2",
        selected && "outline outline-2 outline-main outline-offset-2 rounded",
      )}
      style={{ width: width ? `${width}px` : undefined }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={node.attrs.src}
        alt={node.attrs.alt ?? ""}
        className="block max-w-full h-auto rounded"
        draggable={false}
      />
      {selected && (
        <div
          onMouseDown={startResize}
          className={cn(
            "absolute -right-1 -bottom-1 w-3 h-3 bg-main border-2 border-white rounded-sm cursor-se-resize",
            resizing && "opacity-70",
          )}
          aria-label="이미지 크기 조절"
        />
      )}
    </NodeViewWrapper>
  );
}

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null, parseHTML: (el) => el.getAttribute("width"), renderHTML: (attrs) => (attrs.width ? { width: attrs.width } : {}) },
      height: { default: null, parseHTML: (el) => el.getAttribute("height"), renderHTML: (attrs) => (attrs.height ? { height: attrs.height } : {}) },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

export const CommunityTiptapEditor = forwardRef<
  CommunityTiptapEditorRef,
  CommunityTiptapEditorProps
>(function CommunityTiptapEditor(
  {
    initialContent = "",
    onChange,
    onImageUploaded,
    placeholder = "내용을 입력해 주세요.",
    minHeight = "300px",
    characterLimit,
  },
  ref,
) {
  // useEditor는 config를 초기화 시점에만 캡처할 수 있어서
  // 콜백을 ref로 감싸 최신 값을 안전하게 참조 (stale closure 방지).
  const onChangeRef = useRef(onChange);
  const onImageUploadedRef = useRef(onImageUploaded);
  useEffect(() => {
    onChangeRef.current = onChange;
    onImageUploadedRef.current = onImageUploaded;
  }, [onChange, onImageUploaded]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      ResizableImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" } }),
      CharacterCount.configure({ limit: characterLimit }),
    ],
    content: parseInitial(initialContent),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none py-3 px-4",
        style: `min-height: ${minHeight}`,
      },
      handlePaste: (_view, event) => {
        return handleFilePaste(event.clipboardData?.files);
      },
      handleDrop: (_view, event) => {
        const dt = (event as DragEvent).dataTransfer;
        return handleFilePaste(dt?.files);
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current?.(editor.getJSON(), editor.getText());
    },
  });

  const handleFilePaste = (fileList?: FileList | null): boolean => {
    if (!fileList || fileList.length === 0) return false;
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return false;
    files.forEach((file) => uploadAndInsert(file));
    return true;
  };

  const uploadAndInsert = async (file: File) => {
    if (!editor) return;
    try {
      const { data } = await uploadPostImage(file);
      const url = getImageUrl(data.filePath);
      if (!url) throw new Error("이미지 URL 조합 실패");
      editor.chain().focus().setImage({ src: url }).run();
      // ref 사용으로 stale closure 방지
      onImageUploadedRef.current?.(data.id);
    } catch (e) {
      console.error("이미지 업로드 실패:", e);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleImageButton = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) uploadAndInsert(file);
    };
    input.click();
  };

  const handleLinkButton = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = prompt("링크 URL을 입력해주세요.", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  useImperativeHandle(
    ref,
    () => ({
      getJSON: () => editor?.getJSON() ?? { type: "doc", content: [] },
      getText: () => editor?.getText() ?? "",
      setContent: (content) => editor?.commands.setContent(parseInitial(content)),
      focus: () => editor?.commands.focus(),
    }),
    [editor],
  );

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) {
    return (
      <div
        className="border border-black/10 rounded-[6px] bg-white flex items-center justify-center text-black/30 text-[13px]"
        style={{ minHeight }}
      >
        에디터 로딩 중...
      </div>
    );
  }

  return (
    <div className="border border-black/10 rounded-[6px] bg-white overflow-hidden">
      {/* 툴바 */}
      <div className="flex items-center gap-0.5 flex-wrap border-b border-black/10 px-2 py-1.5">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          label="제목 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="제목 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="제목 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="굵게"
        >
          <BoldIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="기울임"
        >
          <ItalicIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label="취소선"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="목록"
        >
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="번호 목록"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="인용"
        >
          <Quote className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          label="코드 블록"
        >
          <Code className="w-4 h-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={handleImageButton} label="이미지">
          <ImageIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={handleLinkButton} active={editor.isActive("link")} label="링크">
          <LinkIcon className="w-4 h-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          label="실행 취소"
        >
          <Undo className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          label="다시 실행"
        >
          <Redo className="w-4 h-4" />
        </ToolbarBtn>
      </div>

      {/* 본문 */}
      <EditorContent editor={editor} />
    </div>
  );
});

interface ToolbarBtnProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  label: string;
}

function ToolbarBtn({ onClick, children, active, disabled, label }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded transition-colors",
        active
          ? "bg-main/10 text-main"
          : "text-black/60 hover:bg-black/5",
        disabled && "opacity-30 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-black/10 mx-1" />;
}
