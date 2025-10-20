export interface ClubOwner {
  id: number;
  nickname: string;
  profilePath: string | null;
}

export interface ClubImage {
  id: number;
  filePath: string;
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
