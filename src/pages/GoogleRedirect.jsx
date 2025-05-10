import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenLocalStorageRepository } from "../repository/localstorages";

const GoogleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // JWT 저장
      TokenLocalStorageRepository.setToken({ token });

      // 로그인 상태 전파
      window.dispatchEvent(new Event("login"));

      // 홈으로 이동
      navigate("/");
    } else {
      alert("로그인에 실패했거나 토큰이 전달되지 않았습니다.");
      navigate("/login");
    }
  }, [navigate]);

  return <div>로그인 중입니다... 잠시만 기다려주세요.</div>;
};

export default GoogleRedirect;
