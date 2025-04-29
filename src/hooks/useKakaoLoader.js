import { useEffect, useState } from "react";

export const useKakaoLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      setLoaded(true);
      return;
    }

    // 스크립트 동적 삽입
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_API_KEY
    }&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      setLoaded(true);
    };

    document.head.appendChild(script);
  }, []);

  return loaded;
};
