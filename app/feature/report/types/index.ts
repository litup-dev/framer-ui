import type { Id, ISODateTime } from "@/lib/types/common";

export interface ReportCode {
  id: Id;
  code?: string | null;
  name?: string | null;
}

export interface Report {
  id: Id;
  ID: Id;
  report_type: Id;
  entity_id?: Id | null;
  created_at?: ISODateTime | null;
}
