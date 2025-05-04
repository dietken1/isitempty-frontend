import React, { useEffect, useRef, useState } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import SearchBar from "../components/SearchBar";
import KakaoMap from "../components/Kakaomap";
import styles from "./Map.module.css";
import { fetchNearbyParkingLots } from "../api/apiService";
import { fetchNearbyCameras } from "../api/apiService";
import CheckBox from "../components/CheckBox";

const Map = () => {
  const loaded = useKakaoLoader();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaceList, setShowPlaceList] = useState(true);

  const mapRef = useRef(null);
  const placeMarkerRef = useRef([]); // 장소 검색 마커
  const parkingLotMarkersRef = useRef([]); // 주차장 마커
  const cameraMarkersRef = useRef([]); // CCTV 마커
  const toiletMarkersRef = useRef([]); // 화장실 마커

  const [showParking, setShowParking] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showToilet, setShowToilet] = useState(false);

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
    setSelectedPlace(null);
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
    if (selectedPlace && showParking) {
      const map = mapRef.current;
      const center = map.getCenter();
      fetchNearbyParkingLots(center.getLat(), center.getLng())
        .then((parkingLots) => {
          console.log("근처 주차장:", parkingLots);

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
    } else {
      // 체크 해제 시 마커 제거
      parkingLotMarkersRef.current.forEach((marker) => marker.setMap(null));
      parkingLotMarkersRef.current = [];
    }
  }, [selectedPlace, showParking]);

  // 지도 드래그 후 주차장 마커 렌더링
  useEffect(() => {
    if (!loaded || !mapRef.current || !selectedPlace) return;
    const map = mapRef.current;

    const handleDragEnd = () => {
      if (!selectedPlace) return;

      const center = map.getCenter();

      if (showParking) {
        fetchNearbyParkingLots(center.getLat(), center.getLng())
          .then((parkingLots) => {
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
      } else {
        parkingLotMarkersRef.current.forEach((m) => m.setMap(null));
        parkingLotMarkersRef.current = [];
      }
    };

    window.kakao.maps.event.addListener(map, "idle", handleDragEnd);

    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleDragEnd);
    };
  }, [loaded, selectedPlace, showParking]);

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
      <div className={styles.checkboxContainer}>
        <CheckBox
          label="주차장"
          checked={showParking}
          onChange={() => setShowParking((prev) => !prev)}
        />
        <CheckBox
          label="카메라"
          checked={showCamera}
          onChange={() => setShowCamera((prev) => !prev)}
        />
        <CheckBox
          label="화장실"
          checked={showToilet}
          onChange={() => setShowToilet((prev) => !prev)}
        />
      </div>
    </div>
  );
};

export default Map;
