import { useEffect, useState } from "react";

export const useKakaoLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById("kakao-script")) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-script";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_API_KEY
    }&autoload=false`;
    script.async = true;

    script.onload = () => {
      setLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return loaded;
};
