export interface Performance {
  id: number;
  title: string;
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
