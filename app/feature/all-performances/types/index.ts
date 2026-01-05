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
  bookingUrl: string;
  isCanceled: boolean | null;
  artists: Artist[];
  snsLinks: unknown[] | null;
  createdAt: string;
  club: Club;
  images: PerformanceImage[];
}

export interface AllPerformancesData {
  items: PerformanceItem[];
  total: number;
  offset: number;
  limit: number;
}

export interface AllPerformancesResponse {
  data: AllPerformancesData;
}
