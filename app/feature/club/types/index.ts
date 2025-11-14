export interface ClubOwner {
  id: number;
  nickname: string;
  profilePath: string | null;
}

export interface ClubImage {
  id: number;
  filePath: string;
  isMain?: boolean;
}

export interface ClubKeyword {
  id?: number;
  name?: string;
}

export interface Club {
  id: number;
  name: string;
  address: string;
  phone: string;
  capacity: number;
  openTime: string | null;
  closeTime: string | null;
  description: string;
  avgRating: number | null;
  reviewCnt: number | null;
  createdAt: string;
  owner: ClubOwner;
  mainImage?: ClubImage;
  keywords: ClubKeyword[];
}

export interface UpcomingPerform {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  [key: string]: any;
}

export interface ClubDetailData {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string;
  capacity: number;
  openTime: string | null;
  closeTime: string | null;
  avgRating: number | null;
  reviewCnt: number | null;
  createdAt: string;
  owner: ClubOwner;
  images: ClubImage[];
  keywords: ClubKeyword[];
  upcomingPerforms: UpcomingPerform[];
}

export interface ClubDetail {
  data: ClubDetailData;
}
