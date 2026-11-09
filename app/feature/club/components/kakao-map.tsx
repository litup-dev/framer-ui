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
import ClubMapChip from "@/app/feature/club/components/club-map-chip";

const DEFAULT_CENTER = { lat: 37.557, lng: 126.924 };
// 클럽을 선택했을 때 지도 확대 레벨 (숫자가 작을수록 확대)
const FOCUS_LEVEL = 3;
// 이 레벨 이상으로 축소하면 마커를 클러스터로 묶음 (미만이면 클럽 칩으로 표시)
const CLUSTER_MIN_LEVEL = 5;
// 카카오 지도 기본 확대 레벨 (Map 에 level 을 주지 않았을 때)
const DEFAULT_LEVEL = 3;
// 칩은 화면 밖으로 이 비율만큼 여유를 두고 그린다
const CHIP_VIEWPORT_PADDING = 0.1;
const CHIP_Z_INDEX = 5;
const SELECTED_CHIP_Z_INDEX = 10;

interface Viewport {
  level: number;
  south: number;
  west: number;
  north: number;
  east: number;
}
// 바깥 원은 검정 22%, 그 위에 안쪽 원이 검정 21%로 한 번 더 겹친 이중 원
// (겹친 영역은 약 38%). 안쪽 경계는 1px 그라데이션으로 안티앨리어싱 처리
const CLUSTER_OUTER_ALPHA = 0.22;
const CLUSTER_INNER_ALPHA = 1 - (1 - CLUSTER_OUTER_ALPHA) * (1 - 0.21);

// 선택한 클럽이 묶인 클러스터는 같은 이중 원을 프라이머리 색(#FF491A)으로 표시한다.
// 클러스터 DOM 은 카카오가 만들므로 CSS 변수만 덮어쓰고, 해제할 때는 변수만 지운다
const CLUSTER_HIGHLIGHT_VARS = {
  "--cluster-rgb": "255, 73, 26",
  "--cluster-outer-alpha": "0.3",
  "--cluster-inner-alpha": "0.9",
} as const;
// 카카오 클러스터러 기본값. 이 개수 미만은 클러스터가 아니라 개별 마커로 보인다
const CLUSTER_MIN_SIZE = 2;
const SAME_POSITION_EPSILON = 1e-7;

const buildClusterStyle = (
  outer: number,
  inner: number,
  fontSize: number,
): React.CSSProperties => {
  const edge = inner / 2;
  return {
    width: `${outer}px`,
    height: `${outer}px`,
    lineHeight: `${outer}px`,
    textAlign: "center",
    borderRadius: "50%",
    background: `radial-gradient(circle closest-side, rgba(var(--cluster-rgb, 0, 0, 0), var(--cluster-inner-alpha, ${CLUSTER_INNER_ALPHA})) ${edge - 0.5}px, rgba(var(--cluster-rgb, 0, 0, 0), var(--cluster-outer-alpha, ${CLUSTER_OUTER_ALPHA})) ${edge + 0.5}px)`,
    color: "#fff",
    fontFamily: "var(--font-pretendard), var(--font-suit), sans-serif",
    fontSize: `${fontSize}px`,
    fontWeight: 500,
    cursor: "pointer",
  };
};

// [바깥 원 지름, 안쪽 원 지름, 숫자 크기] px
const CLUSTER_SMALL = buildClusterStyle(70, 50, 20);
const CLUSTER_MEDIUM = buildClusterStyle(80, 57, 24);
const CLUSTER_LARGE = buildClusterStyle(90, 64, 28);

// 구간 기준(calculator)은 카카오 기본값(10/100/1000/10000)에 맡기므로
// 구간 5개에 맞춰 가장 큰 스타일을 이어서 사용
const CLUSTER_STYLES = [
  CLUSTER_SMALL,
  CLUSTER_MEDIUM,
  CLUSTER_LARGE,
  CLUSTER_LARGE,
  CLUSTER_LARGE,
];

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
  const queryClient = useQueryClient();
  const [map, setMap] = useState<kakao.maps.Map>();
  const [viewport, setViewport] = useState<Viewport | null>(null);
  // 선택한 클럽이 클러스터에 묶여 있는지 (묶여 있으면 칩 대신 클러스터를 강조)
  const [selectedClustered, setSelectedClustered] = useState(false);

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

  const syncViewport = useCallback((target: kakao.maps.Map) => {
    const bounds = target.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    setViewport({
      level: target.getLevel(),
      south: southWest.getLat(),
      west: southWest.getLng(),
      north: northEast.getLat(),
      east: northEast.getLng(),
    });
  }, []);

  const handleCreate = useCallback(
    (target: kakao.maps.Map) => {
      setMap(target);
      syncViewport(target);
    },
    [syncViewport],
  );

  const isClustered = (viewport?.level ?? DEFAULT_LEVEL) >= CLUSTER_MIN_LEVEL;

  // 클러스터링 이벤트 핸들러에서 최신 선택 위치를 읽기 위한 ref
  const selectedPositionRef = useRef<{ lat: number; lng: number } | null>(null);
  const selectedLat = displayClub?.latitude;
  const selectedLng = displayClub?.longitude;
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  useEffect(() => {
    selectedPositionRef.current =
      selectedLat && selectedLng ? { lat: selectedLat, lng: selectedLng } : null;
    // 선택이 바뀌면 클러스터를 다시 그려서 강조 대상을 갱신한다
    clustererRef.current?.redraw();
  }, [selectedLat, selectedLng]);

  // 클러스터링이 끝날 때마다 선택한 클럽이 묶인 클러스터만 프라이머리 색으로 바꾼다
  const handleClustered = useCallback(
    (_: kakao.maps.MarkerClusterer, clusters: kakao.maps.Cluster[]) => {
      const selected = selectedPositionRef.current;
      let found = false;

      clusters.forEach((cluster) => {
        const content = cluster.getClusterMarker().getContent();
        if (!(content instanceof HTMLElement)) return;

        Object.keys(CLUSTER_HIGHLIGHT_VARS).forEach((name) =>
          content.style.removeProperty(name),
        );

        if (!selected || cluster.getSize() < CLUSTER_MIN_SIZE) return;
        const containsSelected = (cluster.getMarkers() as kakao.maps.Marker[]).some(
          (marker) => {
            const position = marker.getPosition();
            return (
              Math.abs(position.getLat() - selected.lat) < SAME_POSITION_EPSILON &&
              Math.abs(position.getLng() - selected.lng) < SAME_POSITION_EPSILON
            );
          },
        );
        if (!containsSelected) return;

        Object.entries(CLUSTER_HIGHLIGHT_VARS).forEach(([name, value]) =>
          content.style.setProperty(name, value),
        );
        found = true;
      });

      setSelectedClustered(found);
    },
    [],
  );

  // 확대해서 클러스터링이 풀리면 칩이 다시 보이도록 상태를 되돌린다
  useEffect(() => {
    if (!isClustered) setSelectedClustered(false);
  }, [isClustered]);

  const clusterClubs = mapData?.data ?? [];
  const hideSelectedChip = isClustered && selectedClustered;

  const markerClubs = useMemo(
    () => (mapData?.data ?? []).filter((item) => item.id !== displayClub?.id),
    [mapData, displayClub?.id],
  );

  // 선택한 클럽 칩에 오늘 공연 여부를 표시하기 위한 조회용
  const displayHasTodayPerform = useMemo(
    () =>
      (mapData?.data ?? []).find((item) => item.id === displayClub?.id)
        ?.hasTodayPerform ?? false,
    [mapData, displayClub?.id],
  );

  // 클러스터링하지 않는 확대 레벨에서는 화면 안의 클럽만 칩으로 그린다
  const chipClubs = useMemo(() => {
    if (!viewport || viewport.level >= CLUSTER_MIN_LEVEL) return [];
    const latPad = (viewport.north - viewport.south) * CHIP_VIEWPORT_PADDING;
    const lngPad = (viewport.east - viewport.west) * CHIP_VIEWPORT_PADDING;
    return markerClubs.filter(
      (item) =>
        item.latitude >= viewport.south - latPad &&
        item.latitude <= viewport.north + latPad &&
        item.longitude >= viewport.west - lngPad &&
        item.longitude <= viewport.east + lngPad,
    );
  }, [markerClubs, viewport]);

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
        onCreate={handleCreate}
        onIdle={syncViewport}
      >
        <MarkerClusterer
          averageCenter
          minLevel={CLUSTER_MIN_LEVEL}
          styles={CLUSTER_STYLES}
          onCreate={(target) => {
            clustererRef.current = target;
          }}
          onClustered={handleClustered}
          onClusterclick={(_, cluster) =>
            map?.setLevel(Math.max(map.getLevel() - 1, 1), {
              anchor: cluster.getCenter(),
            })
          }
        >
          {isClustered &&
            clusterClubs.map((item) =>
              item.id === displayClub?.id ? (
                // 선택한 클럽도 클러스터 개수에 포함하되, 혼자 남았을 때는
                // 선택 칩이 대신 보이므로 마커 자체는 투명하게 둔다
                <MapMarker
                  key={item.id}
                  position={{ lat: item.latitude, lng: item.longitude }}
                  opacity={0}
                  clickable={false}
                />
              ) : (
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
              ),
            )}
        </MarkerClusterer>
        {chipClubs.map((item) => (
          <CustomOverlayMap
            key={item.id}
            position={{ lat: item.latitude, lng: item.longitude }}
            yAnchor={1}
            zIndex={CHIP_Z_INDEX}
            clickable
          >
            <ClubMapChip
              name={item.name ?? ""}
              hasTodayPerform={item.hasTodayPerform}
              onClick={() => handleMarkerClick(item.id)}
            />
          </CustomOverlayMap>
        ))}
        {displayClub?.latitude && displayClub?.longitude && !hideSelectedChip && (
          <CustomOverlayMap
            position={{
              lat: displayClub.latitude,
              lng: displayClub.longitude,
            }}
            yAnchor={1}
            zIndex={SELECTED_CHIP_Z_INDEX}
            clickable
          >
            <ClubMapChip
              name={displayClub.name}
              hasTodayPerform={displayHasTodayPerform}
              selected
            />
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
