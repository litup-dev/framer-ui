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
