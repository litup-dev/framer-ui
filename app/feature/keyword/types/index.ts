import type { Id } from "@/lib/types/common";

export interface KeywordCode {
  id: Id;
  code?: string | null;
  name?: string | null;
}
