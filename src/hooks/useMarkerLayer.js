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
  useEffect(() => {
    if (!selectedPlace || !show || !mapRef.current) return;
    const map = mapRef.current;
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

          // ✅ 항상 클릭 이벤트를 추가
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
  }, [
    selectedPlace,
    show,
    fetchFn,
    mapRef,
    enableClickCentering,
    onMarkerClick,
  ]);

  // 지도 idle 이벤트로 주변 마커 재렌더링
  useEffect(() => {
    if (!loaded || !mapRef.current || !selectedPlace) return;
    const map = mapRef.current;

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
                console.log("클릭한 마커 데이터:", item);
                onMarkerClick(item);
              }
            });

            return marker;
          });

          markerRef.current = newMarkers;
        })
        .catch((err) => console.error("지도 idle 시 마커 렌더링 실패:", err));
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
