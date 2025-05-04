import React, { useEffect, useRef, useState } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import SearchBar from "../components/SearchBar";
import KakaoMap from "../components/Kakaomap";
import styles from "./Map.module.css";
import { fetchNearbyParkingLots } from "../api/apiService"; // API 호출 함수

const Map = () => {
  const loaded = useKakaoLoader();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaceList, setShowPlaceList] = useState(true);
  const mapRef = useRef(null);
  const markerRef = useRef([]);

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
          const latlng = new window.kakao.maps.LatLng(first.y, first.x);
          mapRef.current.setCenter(latlng);
        }
      } else {
        alert("검색 결과가 존재하지 않거나 오류가 발생했습니다.");
      }
    };

    ps.keywordSearch(keyword, placesSearchCB);
  };

  useEffect(() => {
    if (!mapRef.current || !places.length) return;

    markerRef.current.forEach((marker) => marker.setMap(null));
    markerRef.current = [];

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
        if (!mapRef.current) return;

        markerRef.current.forEach((m) => m.setMap(null));
        markerRef.current = [];

        marker.setMap(mapRef.current);
        markerRef.current.push(marker);

        mapRef.current.setCenter(position);
        mapRef.current.setLevel(5);
        setSelectedPlace(position);
        setShowPlaceList(false);
      });

      newMarkers.push(marker);
    });

    markerRef.current = newMarkers;
  }, [places]);

  useEffect(() => {
    if (
      selectedPlace &&
      typeof selectedPlace.getLat === "function" &&
      typeof selectedPlace.getLng === "function"
    ) {
      console.log(
        "선택된 장소 좌표:",
        selectedPlace.getLat(),
        selectedPlace.getLng()
      );
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (selectedPlace) {
      fetchNearbyParkingLots(selectedPlace.getLat(), selectedPlace.getLng())
        .then((parkingLots) => {
          console.log("근처 주차장:", parkingLots);
          // 마커 생성
        })
        .catch((err) => {
          console.error("API 호출 실패:", err);
        });
    }
  }, [selectedPlace]);

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
          markerRef={markerRef}
          className={styles.placeList}
        />
      )}
    </div>
  );
};

export default Map;
