import { useEffect } from "react";

export function useOverlayLayer({
  selectedPlace,
  show,
  fetchFn,
  markerRef,
  mapRef,
  loaded,
  enableClickCentering = false,
  onMarkerClick,
  getOverlayContent,
}) {
  // 마커 + 오버레이 생성
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!show || !selectedPlace) {
      markerRef.current.forEach(({ marker, overlay }) => {
        marker.setMap(null);
        overlay.setMap(null);
      });
      markerRef.current = [];
      return;
    }

    const center = map.getCenter();
    fetchFn(center.getLat(), center.getLng())
      .then((items) => {
        // 이전 마커 제거
        markerRef.current.forEach(({ marker, overlay }) => {
          marker.setMap(null);
          overlay.setMap(null);
        });
        markerRef.current = [];

        const newMarkers = items.map((item) => {
          const position = new window.kakao.maps.LatLng(
            item.latitude,
            item.longitude
          );

          const marker = new window.kakao.maps.Marker({ map, position });

          const overlay = new window.kakao.maps.CustomOverlay({
            content: getOverlayContent(item),
            position,
            yAnchor: 1,
            zIndex: 3,
            map,
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            if (enableClickCentering) {
              map.setCenter(position);
              map.setLevel(5);
            }
            if (onMarkerClick) {
              onMarkerClick(item);
            }
          });
          return { marker, overlay, id: item.id };
        });

        markerRef.current = newMarkers;
      })
      .catch((err) => console.error("오버레이 레이어 불러오기 실패:", err));
  }, [
    show,
    selectedPlace,
    fetchFn,
    mapRef,
    enableClickCentering,
    onMarkerClick,
    getOverlayContent,
  ]);

  // 지도 이동 후 오버레이 반영
  useEffect(() => {
    const map = mapRef.current;
    if (!loaded || !map || !selectedPlace) return;

    const handleIdle = () => {
      if (!show) return;

      const center = map.getCenter();
      fetchFn(center.getLat(), center.getLng())
        .then((items) => {
          markerRef.current.forEach(({ marker, overlay }) => {
            marker.setMap(null);
            overlay.setMap(null);
          });
          markerRef.current = [];

          const newMarkers = items.map((item) => {
            const position = new window.kakao.maps.LatLng(
              item.latitude,
              item.longitude
            );

            const marker = new window.kakao.maps.Marker({ map, position });

            const overlay = new window.kakao.maps.CustomOverlay({
              content: getOverlayContent(item),
              position,
              yAnchor: 1,
              zIndex: 3,
              map,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              if (enableClickCentering) {
                map.setCenter(position);
                map.setLevel(5);
              }
              if (onMarkerClick) {
                onMarkerClick(item);
              }
            });

            return { marker, overlay, id: item.id };
          });

          markerRef.current = newMarkers;
        })
        .catch((err) => console.error("지도 이동 중 오버레이 갱신 실패:", err));
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
    getOverlayContent,
  ]);
}
