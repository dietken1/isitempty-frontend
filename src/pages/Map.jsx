import React, { useEffect, useRef, useState } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import SearchBar from "../components/SearchBar";
import KakaoMap from "../components/Kakaomap";
import styles from "./Map.module.css";
import { useMarkerLayer } from "../hooks/useMarkerLayer";
import {
  fetchNearbyParkingLots,
  fetchNearbyToilets,
  fetchNearbyCameras,
} from "../api/apiService";
import CheckBox from "../components/CheckBox";
import ParkingList from "../components/ParkingList";
import ParkingDetail from "../components/ParkingDetail";
import { useOverlayLayer } from "../hooks/useOverlayLayer";

const Map = () => {
  const loaded = useKakaoLoader();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaceList, setShowPlaceList] = useState(true);
  const [parkingLots, setParkingLots] = useState([]);
  const [showParkingList, setShowParkingList] = useState(false);
  const [selectedParkingLot, setSelectedParkingLot] = useState(null);
  const [pagination, setPagination] = useState(null);

  const mapRef = useRef(null);
  const placeMarkerRef = useRef([]);
  const parkingLotMarkersRef = useRef([]);
  const cameraMarkersRef = useRef([]);
  const toiletMarkersRef = useRef([]);
  const myLocationMarkerRef = useRef(null);

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
    setSelectedParkingLot(null);
    setShowParkingList(false);
    setPlaces([]);
    setPagination(null);

    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setMap(null);
      myLocationMarkerRef.current = null;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, placesSearchCB);
  };

  const placesSearchCB = (data, status, paginationObj) => {
    if (status === window.kakao.maps.services.Status.OK) {
      mapRef.current.setLevel(5);
      setPlaces(data);
      setShowPlaceList(true);
      setPagination(paginationObj); // 페이지네이션 객체 저장

      placeMarkerRef.current.forEach((m) => m.setMap(null));
      placeMarkerRef.current = [];
      toiletMarkersRef.current.forEach((m) => m.setMap(null));
      toiletMarkersRef.current = [];
      cameraMarkersRef.current.forEach((m) => m.setMap(null));
      cameraMarkersRef.current = [];

      if (data.length > 0 && mapRef.current) {
        const first = data[0];
        const latlng = new window.kakao.maps.LatLng(first.y, first.x);
        mapRef.current.setCenter(latlng);
      }
    } else {
      alert("검색 결과가 존재하지 않거나 오류가 발생했습니다.");
    }
  };

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

  useOverlayLayer({
    selectedPlace,
    show: showParking,
    fetchFn: fetchNearbyParkingLots,
    markerRef: parkingLotMarkersRef,
    mapRef,
    loaded,
    enableClickCentering: true,
    onMarkerClick: (parkingLot) => {
      setShowParkingList(false);
      setSelectedParkingLot(parkingLot);
    },
    getOverlayContent: (item) => {
      const div = document.createElement("div");

      const { availableSpots, slotCount } = item;
      let color = "gray"; // 기본값

      if (
        availableSpots !== null &&
        availableSpots !== undefined &&
        typeof slotCount === "number" &&
        slotCount > 0
      ) {
        const ratio = availableSpots / slotCount;
        if (ratio >= 0.5) {
          color = "green";
        } else if (ratio >= 0.2) {
          color = "orange";
        } else {
          color = "red";
        }
      }

      div.style.cssText = `
        background: white;
        color: ${color};
        border-radius: 50%;
        display: flex;
        font-size: 12px;
        justify-content: center;
        align-items: center;
        width: 22px;
        height: 22px;
        white-space: nowrap;
        transform: translate(3%, -68%);
        pointer-events: none;
        border: 1px solid #ccc;
        font-weight: 700;
      `;

      div.innerText =
        availableSpots !== null && availableSpots !== undefined
          ? availableSpots
          : "x";

      return div;
    },
  });

  useMarkerLayer({
    selectedPlace: selectedPlace,
    show: showCamera,
    fetchFn: async (lat, lng) => {
      const data = await fetchNearbyCameras(lat, lng);
      return data.map((item) => ({ ...item, type: "camera" }));
    },
    markerRef: cameraMarkersRef,
    mapRef,
    loaded,
    enableClickCentering: false,
  });

  useMarkerLayer({
    selectedPlace: selectedPlace,
    show: showToilet,
    fetchFn: async (lat, lng) => {
      const data = await fetchNearbyToilets(lat, lng);
      return data.map((item) => ({ ...item, type: "toilet" }));
    },
    markerRef: toiletMarkersRef,
    mapRef,
    loaded,
    enableClickCentering: false,
  });

  const handleToggleParkingList = async () => {
    if (!mapRef.current) {
      alert("지도가 로드되지 않았습니다.");
      return;
    }

    const center = mapRef.current.getCenter();

    try {
      const data = await fetchNearbyParkingLots(
        center.getLat(),
        center.getLng()
      );
      setParkingLots(data);
      setShowParkingList((prev) => !prev);
    } catch (error) {
      console.error("주차장 목록 불러오기 실패:", error);
    }
  };
  useEffect(() => {
    if (!loaded || !mapRef.current || !selectedParkingLot) return;

    const map = mapRef.current;

    const handleIdle = async () => {
      const center = map.getCenter();
      try {
        const data = await fetchNearbyParkingLots(
          center.getLat(),
          center.getLng()
        );
        setParkingLots(data);
      } catch (error) {
        console.error("맵 이동 시 주차장 목록 불러오기 실패:", error);
      }
    };

    window.kakao.maps.event.addListener(map, "idle", handleIdle);

    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleIdle);
    };
  }, [loaded, mapRef, showParking]);

  return (
    <div className={styles.wrapper}>
      <div id="map" style={{ width: "100%", height: "100%" }} />

      <SearchBar
        className={styles.searchBar}
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={searchPlaces}
        onGpsClick={() => {
          if (!navigator.geolocation) {
            alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const latlng = new window.kakao.maps.LatLng(latitude, longitude);
              setSelectedPlace(latlng);
              if (mapRef.current) {
                mapRef.current.setCenter(latlng);
                mapRef.current.setLevel(5);
              }
              if (myLocationMarkerRef.current) {
                myLocationMarkerRef.current.setMap(null);
              }

              const marker = new window.kakao.maps.Marker({
                map: mapRef.current,
                position: latlng,
                title: "내 위치",
              });

              myLocationMarkerRef.current = marker;
            },
            (error) => {
              console.error("위치 가져오기 실패:", error);
              alert(
                "위치 정보를 가져올 수 없습니다. Wi-Fi 또는 GPS를 켜고 다시 시도해 주세요."
              );
            }
          );
        }}
      />

      {showPlaceList && (
        <KakaoMap
          places={places}
          setSelectedPlace={setSelectedPlace}
          setShowPlaceList={setShowPlaceList}
          mapRef={mapRef}
          markerRef={placeMarkerRef}
          className={styles.placeList}
          pagination={pagination}
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

      {!showParkingList && (
        <button
          onClick={handleToggleParkingList}
          className={styles.toggleListBtn}
        >
          주차장 리스트
        </button>
      )}

      <ParkingList
        parkingLots={parkingLots}
        visible={showParkingList}
        onClose={() => setShowParkingList(false)}
        mapRef={mapRef}
        onSelectLot={(lot) => {
          setSelectedParkingLot(null);
          setTimeout(() => {
            setSelectedParkingLot(lot);
          }, 0);
        }}
      />

      {selectedParkingLot && (
        <ParkingDetail
          lot={selectedParkingLot}
          onClose={() => setSelectedParkingLot(null)}
          onBackToList={async () => {
            setSelectedParkingLot(null);
            if (mapRef.current) {
              const center = mapRef.current.getCenter();
              try {
                const data = await fetchNearbyParkingLots(
                  center.getLat(),
                  center.getLng()
                );
                setParkingLots(data);
              } catch (error) {
                console.error("뒤로가기 시 주차장 목록 불러오기 실패:", error);
              }
            }
            setShowParkingList(true);
          }}
        />
      )}
    </div>
  );
};

export default Map;
