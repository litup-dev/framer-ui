"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

// 백엔드가 저장한 content(문자열)를 Tiptap readonly 로 렌더.
// 우선 JSON.parse 시도, 실패하면 HTML 문자열로 fallback.
interface CommunityHtmlViewerProps {
  content: string;
}

const ImageWithSize = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => el.getAttribute("width"),
        renderHTML: (attrs) => (attrs.width ? { width: attrs.width } : {}),
      },
      height: {
        default: null,
        parseHTML: (el) => el.getAttribute("height"),
        renderHTML: (attrs) => (attrs.height ? { height: attrs.height } : {}),
      },
    };
  },
});

function parseContent(raw: string): object | string {
  const trimmed = raw?.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return raw;
    }
  }
  return raw;
}

export function CommunityHtmlViewer({ content }: CommunityHtmlViewerProps) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      ImageWithSize.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
    ],
    content: parseContent(content),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
