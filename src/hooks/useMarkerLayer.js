import { useEffect } from "react";

export function useMarkerLayer({
  selectedPlace,
  show,
  fetchFn,
  markerRef,
  mapRef,
  loaded,
  enableClickCentering = false,
  onMarkerClick,
}) {
  // ✅ 마커 렌더링 (selectedPlace 바뀌거나, show 토글될 때)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // ⛔ 마커 끄기 조건
    if (!show || !selectedPlace) {
      markerRef.current.forEach((m) => m.setMap(null));
      markerRef.current = [];
      return;
    }

    if (selectedPlace) {
      const center = map.getCenter();
      fetchFn(center.getLat(), center.getLng())
        .then((items) => {
          // 기존 마커 제거
          markerRef.current.forEach((m) => m.setMap(null));
          markerRef.current = [];

          const newMarkers = items.map((item) => {
            const position = new window.kakao.maps.LatLng(
              item.latitude,
              item.longitude
            );

            const marker = new window.kakao.maps.Marker({ map, position });

            window.kakao.maps.event.addListener(marker, "click", () => {
              if (enableClickCentering) {
                map.setCenter(position);
                map.setLevel(5);
              }
              if (onMarkerClick) {
                console.log("클릭한 마커 데이터:", item);
                onMarkerClick(item);
              }
            });

            return marker;
          });

          markerRef.current = newMarkers;
        })
        .catch((err) => console.error("마커 렌더링 실패:", err));
    }
  }, [
    show,
    selectedPlace,
    fetchFn,
    mapRef,
    enableClickCentering,
    onMarkerClick,
  ]);

  // ✅ idle 이벤트로 새로고침
  useEffect(() => {
    const map = mapRef.current;
    if (!loaded || !map || !selectedPlace) return;

    const handleIdle = () => {
      if (!show) {
        markerRef.current.forEach((m) => m.setMap(null));
        markerRef.current = [];
        return;
      }

      const center = map.getCenter();
      fetchFn(center.getLat(), center.getLng())
        .then((items) => {
          markerRef.current.forEach((m) => m.setMap(null));
          markerRef.current = [];

          const newMarkers = items.map((item) => {
            const position = new window.kakao.maps.LatLng(
              item.latitude,
              item.longitude
            );
            const marker = new window.kakao.maps.Marker({ map, position });

            window.kakao.maps.event.addListener(marker, "click", () => {
              if (enableClickCentering) {
                map.setCenter(position);
                map.setLevel(5);
              }
              if (onMarkerClick) {
                console.log("idle 중 클릭한 마커:", item);
                onMarkerClick(item);
              }
            });

            return marker;
          });

          markerRef.current = newMarkers;
        })
        .catch((err) => console.error("idle 시 마커 렌더링 실패:", err));
    };

    window.kakao.maps.event.addListener(map, "idle", handleIdle);
    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleIdle);
    };
  }, [
    loaded,
    selectedPlace,
    show,
    fetchFn,
    mapRef,
    enableClickCentering,
    onMarkerClick,
  ]);
}
