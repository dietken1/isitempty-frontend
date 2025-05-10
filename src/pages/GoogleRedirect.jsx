import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenLocalStorageRepository } from "../repository/localstorages";

const GoogleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      TokenLocalStorageRepository.setToken({ token });
      window.dispatchEvent(new Event("login"));
      navigate("/");
    } else {
      console.error("토큰 없음");
    }
  }, []);

  return <p>로그인 처리 중...</p>;
};

export default GoogleRedirect;
