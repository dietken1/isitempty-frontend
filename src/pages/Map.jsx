import React, { useEffect, useState } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import SearchBar from "../components/SearchBar";
import PlaceList from "../components/PlaceList";

const Map = () => {
  const loaded = useKakaoLoader();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (!loaded) return;

    // 반드시 maps.load() 안에서 사용
    window.kakao.maps.load(() => {
      const container = document.getElementById("map");

      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
      window.map = map; // 전역 등록
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
        setPlaces(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
      } else {
        alert("검색 중 오류가 발생했습니다.");
      }
    };

    ps.keywordSearch(keyword, placesSearchCB);
  };

  return (
    <>
      <div id="map" style={{ width: "100%", height: "400px" }} />

      <SearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={searchPlaces}
      />

      <PlaceList places={places} />
    </>
  );
};

export default Map;
