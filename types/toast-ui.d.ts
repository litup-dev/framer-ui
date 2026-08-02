declare module "@toast-ui/editor/viewer" {
  interface ViewerOptions {
    el: HTMLElement;
    initialValue?: string;
    height?: string;
    theme?: string;
    linkAttributes?: Record<string, string>;
  }

  class Viewer {
    constructor(options: ViewerOptions);
    setMarkdown(markdown: string): void;
    destroy(): void;
  }

  export default Viewer;
}

declare module "@toast-ui/editor" {
  interface EditorOptions {
    el: HTMLElement;
    initialValue?: string;
    initialEditType?: "markdown" | "wysiwyg";
    previewStyle?: "vertical" | "tab";
    height?: string;
    placeholder?: string;
    theme?: string;
    usageStatistics?: boolean;
    hooks?: {
      addImageBlobHook?: (
        blob: Blob,
        callback: (url: string, altText: string) => void,
      ) => void | Promise<void>;
    };
    events?: {
      change?: () => void;
      load?: () => void;
      focus?: () => void;
      blur?: () => void;
    };
  }

  class Editor {
    constructor(options: EditorOptions);
    getMarkdown(): string;
    setMarkdown(markdown: string): void;
    getHTML(): string;
    setHTML(html: string): void;
    focus(): void;
    blur(): void;
    reset(): void;
    destroy(): void;
  }

  export default Editor;
}
