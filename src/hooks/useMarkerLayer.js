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
  // 마커 렌더링
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

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

            let markerImage = null;
            if (item.type === "camera") {
              markerImage = new window.kakao.maps.MarkerImage(
                "/images/camera.svg",
                new window.kakao.maps.Size(32, 32)
              );
            } else if (item.type === "toilet") {
              markerImage = new window.kakao.maps.MarkerImage(
                "/images/toilet.svg",
                new window.kakao.maps.Size(32, 32)
              );
            }

            const marker = new window.kakao.maps.Marker({
              map,
              position,
              ...(markerImage && { image: markerImage }),
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

            return marker;
          });

          markerRef.current = newMarkers;
        })
        .catch((err) => {
          console.error("마커를 가져오는 중 오류:", err);
        });
    }
  }, [
    show,
    selectedPlace,
    fetchFn,
    mapRef,
    enableClickCentering,
    onMarkerClick,
  ]);

  //지도 이동후 마커 렌더링
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
            let markerImage = null;
            if (item.type === "camera") {
              markerImage = new window.kakao.maps.MarkerImage(
                "/images/camera.svg",
                new window.kakao.maps.Size(32, 32)
              );
            } else if (item.type === "toilet") {
              markerImage = new window.kakao.maps.MarkerImage(
                "/images/toilet.svg",
                new window.kakao.maps.Size(32, 32)
              );
            }

            const marker = new window.kakao.maps.Marker({
              map,
              position,
              ...(markerImage && { image: markerImage }), // 이미지 있을 때만 적용
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

            return marker;
          });

          markerRef.current = newMarkers;
        })
        .catch((err) => {
          console.error("마커를 가져오는 중 오류:", err);
        });
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
