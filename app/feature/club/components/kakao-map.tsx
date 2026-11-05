"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Map,
  CustomOverlayMap,
  MapMarker,
  MarkerClusterer,
} from "react-kakao-maps-sdk";
import useKakaoLoader from "@/lib/kakao-map-loader";

import { Club } from "@/app/feature/club/types";
import {
  getClubByIdOptions,
  getClubMapOptions,
} from "@/app/feature/club/query-options";

import ClubInfoCard from "@/app/feature/club/components/club-info-card";

const DEFAULT_CENTER = { lat: 37.557, lng: 126.924 };
// 클럽을 선택했을 때 지도 확대 레벨 (숫자가 작을수록 확대)
const FOCUS_LEVEL = 3;
// 이 레벨 이상으로 축소하면 마커를 클러스터로 묶음
const CLUSTER_MIN_LEVEL = 5;

const useIsMdOrLarger = () => {
  const [isMdOrLarger, setIsMdOrLarger] = useState(false);
  useEffect(() => {
    const check = () => setIsMdOrLarger(window.innerWidth >= 744);
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
  onSelectClub?: (club: Club) => void;
}

const KakaoMap = ({ club, clubs, placeInfo, onSelectClub }: KakaoMapProps) => {
  useKakaoLoader();
  const isMdOrLarger = useIsMdOrLarger();
  const queryClient = useQueryClient();
  const [map, setMap] = useState<kakao.maps.Map>();

  const { data: mapData } = useQuery(getClubMapOptions());

  const firstClub = clubs && clubs.length > 0 ? clubs[0] : null;
  const displayClub = club ?? firstClub;
  const firstLat = firstClub?.latitude;
  const firstLng = firstClub?.longitude;

  // 지도 중심은 최초 한 번만 지정하고 이후 이동은 아래 effect에서 처리
  const initialCenter = useRef(
    displayClub?.latitude && displayClub?.longitude
      ? { lat: displayClub.latitude, lng: displayClub.longitude }
      : DEFAULT_CENTER,
  ).current;

  // 선택한 클럽으로 이동
  useEffect(() => {
    if (!map || !club?.latitude || !club?.longitude) return;
    map.setLevel(FOCUS_LEVEL);
    map.panTo(new kakao.maps.LatLng(club.latitude, club.longitude));
  }, [map, club]);

  // 선택한 클럽이 없으면 목록의 첫 번째 클럽이 지도 기준
  useEffect(() => {
    if (!map || club || !firstLat || !firstLng) return;
    map.panTo(new kakao.maps.LatLng(firstLat, firstLng));
  }, [map, club, firstClub?.id, firstLat, firstLng]);

  const markerClubs = useMemo(
    () => (mapData?.data ?? []).filter((item) => item.id !== displayClub?.id),
    [mapData, displayClub?.id],
  );

  const handleMarkerClick = useCallback(
    async (id: number) => {
      if (!onSelectClub) return;
      try {
        const detail = await queryClient.fetchQuery({
          ...getClubByIdOptions(String(id)),
          staleTime: 60 * 1000,
        });
        onSelectClub({
          ...detail.data,
          description: detail.data.description ?? "",
        });
      } catch {
        // 상세 조회에 실패하면 기존 선택 상태를 유지
      }
    },
    [onSelectClub, queryClient],
  );

  return (
    <div className="w-full h-full relative">
      <Map
        center={initialCenter}
        className="w-full h-full"
        onCreate={setMap}
      >
        <MarkerClusterer
          averageCenter
          minLevel={CLUSTER_MIN_LEVEL}
          onClusterclick={(_, cluster) =>
            map?.setLevel(Math.max(map.getLevel() - 1, 1), {
              anchor: cluster.getCenter(),
            })
          }
        >
          {markerClubs.map((item) => (
            <MapMarker
              key={item.id}
              position={{ lat: item.latitude, lng: item.longitude }}
              title={item.name ?? undefined}
              image={{
                src: "/images/map-pin.svg",
                size: { width: 32, height: 32 },
                options: { offset: { x: 16, y: 32 } },
              }}
              onClick={() => handleMarkerClick(item.id)}
            />
          ))}
        </MarkerClusterer>
        {displayClub?.latitude && displayClub?.longitude && (
          <MapMarker
            position={{
              lat: displayClub.latitude,
              lng: displayClub.longitude,
            }}
            zIndex={10}
            image={{
              src: "/images/map-pin.svg",
              size: {
                width: 40,
                height: 40,
              },
              options: {
                offset: {
                  x: 20,
                  y: 40,
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
              zIndex={11}
            >
              <div className="pb-15">
                <ClubInfoCard club={displayClub} isOverlay />
              </div>
            </CustomOverlayMap>
          )}
      </Map>
      {!placeInfo && (club || (clubs && clubs.length > 0)) && (
        <div className="absolute inset-x-0 bottom-4 z-20 lg:hidden">
          <ClubInfoCard club={club || clubs![0]} />
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
