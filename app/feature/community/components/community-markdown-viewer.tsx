"use client";

import { useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

interface CommunityMarkdownViewerProps {
  content: string;
}

export function CommunityMarkdownViewer({ content }: CommunityMarkdownViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let viewer: { destroy: () => void } | null = null;

    import("@toast-ui/editor/viewer").then(({ default: Viewer }) => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      viewer = new Viewer({
        el: containerRef.current,
        initialValue: content,
      });
    });

    return () => {
      viewer?.destroy();
    };
  }, [content]);

  return <div ref={containerRef} className="toastui-viewer" />;
}
