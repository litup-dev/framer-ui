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
