import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenLocalStorageRepository } from "../repository/localstorages";

const GoogleRedirect = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      TokenLocalStorageRepository.setToken({ token });
      window.dispatchEvent(new Event("login"));
      navigate("/");
    } else if (error) {
      const decodedError = decodeURIComponent(error);

      // 에러 메시지 매핑
      if (decodedError.includes("Duplicate entry")) {
        setErrorMessage(
          "이미 가입된 이메일입니다. 일반 로그인으로 시도해 주세요."
        );
      } else {
        setErrorMessage("소셜 로그인 중 오류가 발생했습니다: " + decodedError);
      }
    } else {
      setErrorMessage("알 수 없는 오류가 발생했습니다.");
    }
  }, []);

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      {errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <p>로그인 처리 중...</p>
      )}
    </div>
  );
};

export default GoogleRedirect;
