"use client";

import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { uploadPostImage } from "../api";
import { getImageUrl } from "@/lib/utils";

// Toast Editor 인스턴스의 필요 최소 타입
interface EditorInstance {
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
  destroy: () => void;
}

export interface CommunityToastEditorRef {
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
}

interface CommunityToastEditorProps {
  initialValue?: string;
  onChange?: (markdown: string) => void;
  onImageUploaded?: (imageId: number) => void;
  minHeight?: string;
  height?: string;
  placeholder?: string;
}

export const CommunityToastEditor = forwardRef<
  CommunityToastEditorRef,
  CommunityToastEditorProps
>(function CommunityToastEditor(
  {
    initialValue = "",
    onChange,
    onImageUploaded,
    minHeight = "300px",
    height = "500px",
    placeholder = "내용을 입력해 주세요.",
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorInstance | null>(null);
  const initialValueRef = useRef(initialValue);
  const onChangeRef = useRef(onChange);
  const onImageUploadedRef = useRef(onImageUploaded);

  useEffect(() => {
    onChangeRef.current = onChange;
    onImageUploadedRef.current = onImageUploaded;
  }, [onChange, onImageUploaded]);

  useImperativeHandle(
    ref,
    () => ({
      getMarkdown: () => editorRef.current?.getMarkdown() ?? "",
      setMarkdown: (v: string) => editorRef.current?.setMarkdown(v),
    }),
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    import("@toast-ui/editor").then(({ default: Editor }) => {
      if (disposed || !containerRef.current) return;

      containerRef.current.innerHTML = "";

      const editor = new Editor({
        el: containerRef.current,
        initialValue: initialValueRef.current,
        initialEditType: "wysiwyg",
        previewStyle: "vertical",
        height,
        placeholder,
        usageStatistics: false,
        hooks: {
          addImageBlobHook: async (blob, callback) => {
            try {
              const file =
                blob instanceof File
                  ? blob
                  : new File([blob], `image-${Date.now()}.png`, {
                      type: blob.type || "image/png",
                    });
              const { data } = await uploadPostImage(file);
              const url = getImageUrl(data.filePath);
              if (!url) throw new Error("이미지 URL 조합 실패");
              callback(url, "");
              onImageUploadedRef.current?.(data.id);
            } catch (e) {
              console.error("이미지 업로드 실패:", e);
              alert("이미지 업로드에 실패했습니다.");
            }
          },
        },
        events: {
          change: () => {
            const md = editor.getMarkdown();
            onChangeRef.current?.(md);
          },
        },
      });

      editorRef.current = editor as EditorInstance;
    });

    return () => {
      disposed = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} style={{ minHeight }} />;
});
