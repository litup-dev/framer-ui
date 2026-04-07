export interface PostsItem {
  id: number;
  title: string;
  content: string;
}

export interface CalendarPerformance {
  id: number;
  performDate: string;
  artists: Array<{ name: string }>;
  club: { id: number; name: string };
  images: Array<{
    id: number;
    filePath: string;
    isMain: boolean;
  }>;
}

export interface Performance {
  id: number;
  performDate: string;
  artists: Array<{ name: string }>;
  images: Array<{
    id: number;
    filePath: string;
    isMain: boolean;
  }>;
}

export interface CalendarEvent {
  id: number;
  clubName: string;
  performances: Performance[];
}

export interface CalendarEventsResponse {
  data: Record<string, Array<{ performances: CalendarPerformance[] }>>;
}

export interface Artist {
  name: string;
}

export interface PerformanceImage {
  id: number;
  filePath: string;
  isMain: boolean;
}

export interface Club {
  id: number;
  name: string;
  address: string;
}

export interface PerformanceItem {
  id: number;
  title: string;
  description: string;
  performDate: string;
  bookingPrice: number;
  onsitePrice: number;
  bookingUrl: string | null;
  isCanceled: boolean;
  artists: Artist[];
  snsLinks: unknown[];
  createdAt: string;
  club: Club;
  images: PerformanceImage[];
}

export interface PerformancesData {
  items: PerformanceItem[];
  total: number;
  offset: number;
  limit: number;
}

export interface PerformancesResponse {
  data: PerformancesData;
}
