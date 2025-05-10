import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginUser, getUserMe } from "../api/apiService";
import { TokenLocalStorageRepository } from "../repository/localstorages";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();
  const { getToken, setToken } = TokenLocalStorageRepository;

  const handleLogin = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setLoading(true);

    try {
      const res = await loginUser(userId, password);
      console.log(res);
      setToken({ token: res.data.body.token });
      console.log(res.data.body.token);
      window.dispatchEvent(new Event("login"));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setResponseMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 로그인된 토큰이 있으면 자동 로그인
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    getUserMe()
      .then(() => navigate("/"))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      // tokenResponse.code === 인증 코드
      try {
        const res = await fetch("/oauth2/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: tokenResponse.code,
          }),
        });

        if (!res.ok) throw new Error("Google login failed");
        const data = await res.json();

        setToken({ token: data.accessToken });
        window.dispatchEvent(new Event("login"));
        navigate("/");
      } catch (err) {
        console.error("Google login error:", err);
      }
    },
    onError: () => {
      console.log("Google login failed");
    },
    redirect_uri: "http://localhost:8080/oauth2/authorization/google",
  });

  return (
    <div className="login-container">
      <div className="login_container">
        <form onSubmit={handleLogin}>
          <h1 className="form-title">Login</h1>

          <div className="login_elements">
            <div className="input-group">
              <label htmlFor="userId" className="input-label">
                아이디
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디"
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="input-field"
              />
            </div>
          </div>

          <div className="login_btn">
            <button type="submit" className="login-btn" disabled={loading}>
              로그인
            </button>
          </div>
          {responseMessage && (
            <p className="invalid-credentials">{responseMessage}</p>
          )}

          <div className="login-add">
            <p className="login-link">
              아직 계정이 없으신가요? <a href="/signup">회원가입</a>
            </p>
          </div>

          <hr />
          <div className="social-login">
            <p>소셜 로그인</p>
            <button type="button" className="google" onClick={() => login()}>
              <img src="/images/google.png" alt="구글 로그인" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
