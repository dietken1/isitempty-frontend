import { useEffect } from "react";

export function useMarkerLayer({
  selectedPlace,
  show,
  fetchFn,
  markerRef,
  mapRef,
  loaded,
}) {
  useEffect(() => {
    if (selectedPlace && show) {
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
            const marker = new window.kakao.maps.Marker({
              map,
              position,
            });
            return marker;
          });

          markerRef.current = newMarkers;
        })
        .catch((err) => console.error("마커 렌더링 실패:", err));
    } else {
      markerRef.current.forEach((m) => m.setMap(null));
      markerRef.current = [];
    }
  }, [selectedPlace, show]);

  // 지도 드래그 후 마커 렌더링
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
            const marker = new window.kakao.maps.Marker({
              map,
              position,
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
  }, [loaded, selectedPlace, show]);
}
