export type Id = number;
export type ISODateTime = string;
export type ISOTime = string;

export type GeoPoint4326 = {
  lat: number;
  lng: number;
};

export interface Paginated<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
