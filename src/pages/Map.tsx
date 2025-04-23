import { useEffect } from "react";
import React from "react";
import { useKakaoLoader } from "../hooks/useKakaoLoader";

const KakaoMap = () => {
  const loaded = useKakaoLoader();

  useEffect(() => {
    if (!loaded) return;

    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      new window.kakao.maps.Map(container, options);
    });
  }, [loaded]);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default KakaoMap;
