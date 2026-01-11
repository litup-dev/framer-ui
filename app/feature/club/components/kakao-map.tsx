"use client";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/lib/kakao-map-loader";

import { Club } from "@/app/feature/club/types";

import ClubInfoCard from "@/app/feature/club/components/club-info-card";

interface KakaoMapProps {
  club: Club | null;
  clubs?: Club[];
  placeInfo?: {
    lat: number;
    lng: number;
  };
}

const KakaoMap = ({ club, clubs, placeInfo }: KakaoMapProps) => {
  useKakaoLoader();

  const getDefaultCenter = () => {
    const firstClub = clubs && clubs.length > 0 ? clubs[0] : null;
    if (firstClub?.latitude && firstClub?.longitude) {
      return { lat: firstClub.latitude, lng: firstClub.longitude };
    }
    return { lat: 37.557, lng: 126.924 };
  };

  const defaultCenter = getDefaultCenter();
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
        {!club &&
          clubs &&
          clubs.map((clubItem) => {
            if (clubItem.latitude && clubItem.longitude) {
              return (
                <MapMarker
                  key={clubItem.id}
                  position={{
                    lat: clubItem.latitude,
                    lng: clubItem.longitude,
                  }}
                  title={clubItem.name}
                />
              );
            }
            return null;
          })}
      </Map>
      {!placeInfo && club && <ClubInfoCard club={club} />}
    </div>
  );
};

export default KakaoMap;
