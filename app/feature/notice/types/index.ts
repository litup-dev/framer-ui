export interface NoticeAuthor {
  id: number;
  nickname: string | null;
}

export interface NoticeListItem {
  id: number;
  title: string;
  content: string;
  isPopup: boolean;
  createdAt: string;
  updatedAt: string | null;
  author: NoticeAuthor;
}

export interface NoticeListData {
  items: NoticeListItem[];
  total: number;
  offset: number;
  limit: number;
}

export interface NoticeListResponse {
  data: NoticeListData;
}

export interface PopupNotice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface PopupNoticesResponse {
  data: {
    items: PopupNotice[];
  };
}

export type NoticeSort = "-createdAt" | "createdAt" | "-title" | "title";
