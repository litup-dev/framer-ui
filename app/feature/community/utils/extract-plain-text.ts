// 목록 카드용 본문 미리보기 텍스트 추출.
// 백엔드가 내려주는 content는 Tiptap JSON 문자열(또는 HTML)이라 그대로 렌더링할 수 없어
// 텍스트 노드만 뽑아 이어붙인 뒤 line-clamp로 2줄만 보여준다.
interface TiptapNode {
  type?: string;
  text?: string;
  content?: TiptapNode[];
}

function stripHtml(raw: string): string {
  return raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function collectText(node: TiptapNode, parts: string[]): void {
  if (node.type === "text" && node.text) parts.push(node.text);
  node.content?.forEach((child) => collectText(child, parts));
}

export function extractPlainText(raw: string | undefined | null): string {
  const trimmed = raw?.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const doc = JSON.parse(trimmed) as TiptapNode;
      const parts: string[] = [];
      collectText(doc, parts);
      return parts.join(" ").replace(/\s+/g, " ").trim();
    } catch {
      return stripHtml(trimmed);
    }
  }

  return stripHtml(trimmed);
}
