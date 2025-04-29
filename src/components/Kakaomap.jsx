import React, { useEffect, useState } from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";
import SearchBar from "./SearchBar";
import PlaceList from "./PlaceList";

const KakaoMap = () => {
  const loaded = useKakaoLoader();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const searchPlaces = () => {
    if (!window.kakao || !window.kakao.maps) return;

    if (!keyword.trim()) {
      alert("주소나 장소를 입력해주세요!");
      return;
    }

    const ps = new window.kakao.maps.services.Places();

    const placesSearchCB = (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSelectedPlace(null);
        setPlaces(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
      } else {
        alert("검색 중 오류가 발생했습니다.");
      }
    };

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", newUrl);

    ps.keywordSearch(keyword, placesSearchCB);
  };

  useEffect(() => {
    if (!loaded) return;

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);
    window.map = map;
  }, [loaded]);

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

export default KakaoMap;
