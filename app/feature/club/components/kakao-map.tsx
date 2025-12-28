"use client";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/lib/kakao-map-loader";

import { Club } from "@/app/feature/club/types";

import ClubInfoCard from "@/app/feature/club/components/club-info-card";

interface KakaoMapProps {
  club: Club | null;
  placeInfo?: {
    lat: number;
    lng: number;
  };
}

const KakaoMap = ({ club, placeInfo }: KakaoMapProps) => {
  useKakaoLoader();

  const defaultCenter = { lat: 37.557, lng: 126.924 };
  const center =
    club?.latitude && club?.longitude
      ? { lat: club.latitude, lng: club.longitude }
      : defaultCenter;

  return (
    <div className="w-full h-full relative">
      <Map center={center} className="w-full h-full" draggable={!club}>
        {club && club.latitude && club.longitude && (
          <MapMarker
            key={club.id}
            position={{ lat: club.latitude, lng: club.longitude }}
            title={club.name}
          />
        )}
      </Map>
      {!placeInfo && club && <ClubInfoCard club={club} />}
    </div>
  );
};

export default KakaoMap;
