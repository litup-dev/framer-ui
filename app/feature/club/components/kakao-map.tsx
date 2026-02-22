"use client";

import { useState, useEffect } from "react";
import { Map, CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/lib/kakao-map-loader";

import { Club } from "@/app/feature/club/types";

import ClubInfoCard from "@/app/feature/club/components/club-info-card";

const useIsMdOrLarger = () => {
  const [isMdOrLarger, setIsMdOrLarger] = useState(false);
  useEffect(() => {
    const check = () => setIsMdOrLarger(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMdOrLarger;
};

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
  const isMdOrLarger = useIsMdOrLarger();

  const displayClub = club ?? (clubs && clubs.length > 0 ? clubs[0] : null);

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
        {displayClub?.latitude && displayClub?.longitude && (
          <MapMarker
            position={{
              lat: displayClub.latitude,
              lng: displayClub.longitude,
            }}
            image={{
              src: "/images/map-pin.svg",
              size: {
                width: 40,
                height: 40,
              },
              options: {
                offset: {
                  x: 27,
                  y: 69,
                },
              },
            }}
          />
        )}
        {isMdOrLarger &&
          displayClub &&
          displayClub.latitude &&
          displayClub.longitude && (
            <CustomOverlayMap
              key={displayClub.id}
              position={{
                lat: displayClub.latitude,
                lng: displayClub.longitude,
              }}
              yAnchor={1}
            >
              <div className="pb-15">
                <ClubInfoCard club={displayClub} isOverlay />
              </div>
            </CustomOverlayMap>
          )}
      </Map>
      {!placeInfo && (club || (clubs && clubs.length > 0)) && (
        <div className="absolute inset-x-0 bottom-4 z-20 md:hidden">
          <ClubInfoCard club={club || clubs![0]} />
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
