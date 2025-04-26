import { useEffect } from "react";
import React from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";

const KakaoMap = () => {
  useKakaoLoader();

  useEffect(() => {
    const onLoadKakaoMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청
        level: 3,
      };
      new window.kakao.maps.Map(container, options);
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(onLoadKakaoMap);
    }
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default KakaoMap;
