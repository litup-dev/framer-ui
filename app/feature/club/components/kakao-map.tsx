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

  return (
    <div className="w-full h-full relative">
      <Map
        center={{ lat: 37.49793, lng: 127.027596 }}
        className="w-full h-full"
        draggable={!club}
      >
        {club && (
          <MapMarker
            key={club.id}
            position={{ lat: 37.49793, lng: 127.027596 }}
            title={club.name}
          />
        )}
      </Map>
      {!placeInfo && club && <ClubInfoCard club={club} />}
    </div>
  );
};

export default KakaoMap;
