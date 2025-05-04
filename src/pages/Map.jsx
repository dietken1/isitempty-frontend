import React, { useEffect, useRef, useState } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import SearchBar from "../components/SearchBar";
import KakaoMap from "../components/Kakaomap";
import styles from "./Map.module.css";
import { fetchNearbyParkingLots } from "../api/apiService";

const Map = () => {
  const loaded = useKakaoLoader();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaceList, setShowPlaceList] = useState(true);
  const mapRef = useRef(null);

  const placeMarkerRef = useRef([]); // 장소 검색 마커
  const parkingLotMarkersRef = useRef([]); // 주차장 마커

  useEffect(() => {
    if (!loaded) return;

    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };

      mapRef.current = new window.kakao.maps.Map(container, options);
    });
  }, [loaded]);

  const searchPlaces = () => {
    if (!window.kakao || !window.kakao.maps) return;

    if (!keyword.trim()) {
      alert("주소나 장소를 입력해주세요!");
      return;
    }

    const ps = new window.kakao.maps.services.Places();

    const placesSearchCB = (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        mapRef.current.setLevel(5);
        setPlaces(data);
        setShowPlaceList(true);

        if (data.length > 0 && mapRef.current) {
          const first = data[0];
          placeMarkerRef.current.forEach((marker) => marker.setMap(null));
          placeMarkerRef.current = [];
          parkingLotMarkersRef.current.forEach((marker) => marker.setMap(null));
          parkingLotMarkersRef.current = [];
          const latlng = new window.kakao.maps.LatLng(first.y, first.x);
          mapRef.current.setCenter(latlng);
        }
      } else {
        alert("검색 결과가 존재하지 않거나 오류가 발생했습니다.");
      }
    };

    ps.keywordSearch(keyword, placesSearchCB);
  };

  // 검색 결과 장소 마커 렌더링
  useEffect(() => {
    if (!mapRef.current || !places.length) return;

    const newMarkers = [];

    places.forEach((place, idx) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
      const imageSize = new window.kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new window.kakao.maps.Size(36, 691),
        spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
        offset: new window.kakao.maps.Point(13, 37),
      };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imgOptions
      );

      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position,
        image: markerImage,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        mapRef.current.setCenter(position);
        mapRef.current.setLevel(5);
        setSelectedPlace(position);
        setShowPlaceList(false);
        placeMarkerRef.current.forEach((m) => {
          if (m !== marker) m.setMap(null);
        });

        placeMarkerRef.current = [marker];
      });

      newMarkers.push(marker);
    });

    placeMarkerRef.current = newMarkers;
  }, [places]);

  // 최초 주변 주차장 마커 렌더링
  useEffect(() => {
    if (selectedPlace) {
      fetchNearbyParkingLots(selectedPlace.getLat(), selectedPlace.getLng())
        .then((parkingLots) => {
          console.log("근처 주차장:", parkingLots);

          // 기존 주차장 마커 제거
          parkingLotMarkersRef.current.forEach((marker) => marker.setMap(null));
          parkingLotMarkersRef.current = [];

          const newMarkers = parkingLots.map((lot) => {
            const position = new window.kakao.maps.LatLng(
              lot.latitude,
              lot.longitude
            );

            const marker = new window.kakao.maps.Marker({
              map: mapRef.current,
              position,
            });

            return marker;
          });

          parkingLotMarkersRef.current = newMarkers;
        })
        .catch((err) => {
          console.error("API 호출 실패:", err);
        });
    }
  }, [selectedPlace]);

  // 지도 드래그 후 주차장 마커 렌더링
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const handleDragEnd = () => {
      const center = map.getCenter();
      const lat = center.getLat();
      const lng = center.getLng();

      console.log("지도 중심 이동됨:", lat, lng);

      fetchNearbyParkingLots(lat, lng)
        .then((parkingLots) => {
          console.log("이동 후 주차장:", parkingLots);

          parkingLotMarkersRef.current.forEach((m) => m.setMap(null));
          parkingLotMarkersRef.current = [];

          const newMarkers = parkingLots.map((lot) => {
            const position = new window.kakao.maps.LatLng(
              lot.latitude,
              lot.longitude
            );

            const marker = new window.kakao.maps.Marker({
              map,
              position,
            });

            return marker;
          });

          parkingLotMarkersRef.current = newMarkers;
        })
        .catch((err) => {
          console.error("지도 이동 시 API 실패:", err);
        });
    };

    // 중심 좌표 변경 감지 (드래그, 줌 등)
    window.kakao.maps.event.addListener(map, "idle", handleDragEnd);

    // 정리 함수 (컴포넌트 언마운트 시)
    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleDragEnd);
    };
  }, [loaded]);

  return (
    <div className={styles.wrapper}>
      <div id="map" style={{ width: "100%", height: "100%" }} />

      <SearchBar
        className={styles.searchBar}
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={searchPlaces}
      />

      {showPlaceList && (
        <KakaoMap
          places={places}
          setSelectedPlace={setSelectedPlace}
          setShowPlaceList={setShowPlaceList}
          mapRef={mapRef}
          markerRef={placeMarkerRef}
          className={styles.placeList}
        />
      )}
    </div>
  );
};

export default Map;
