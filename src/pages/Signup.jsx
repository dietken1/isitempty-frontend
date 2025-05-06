import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/apiService";

const signupUser = (formData) => {
  return loginApi({
    path: "users/signup",
    method: "POST",
    body: formData,
  });
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const isFormValid =
    email.trim() !== "" &&
    name.trim() !== "" &&
    username.trim() !== "" &&
    password !== "" &&
    passwordConfirm !== "";

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setResponseMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const formData = {
      email,
      name,
      username,
      password1: password,
      password2: passwordConfirm,
    };

    signupUser(formData)
      .then((response) => {
        if (response.type === "error") {
          setResponseMessage(response.message);
          return;
        }
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        setResponseMessage("오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="signup-container">
      <div className="signup_container">
        <form onSubmit={handleSignup}>
          <div className="signup_elements">
            <h1>Signup</h1>
            <div>
              <label htmlFor="ID">아이디</label>
              <input
                type="text"
                id="ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디"
              />
            </div>
            <div>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
              />
            </div>
            <div>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 확인"
              />
            </div>
            <div>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
              />
            </div>
          </div>
          <div className="signup-button">
            <button
              onClick={handleSignup}
              disabled={!isFormValid || loading}
              className="signup-btn"
            >
              회원가입
            </button>
          </div>
          <div className="signup-add">
            <p className="signup-link">
              이미 계정이 있으신가요? <a href="/login">로그인</a>
            </p>
          </div>
          <hr />
          <div className="social-login">
            <p>소셜 로그인</p>
            <button
              type="button"
              className="naver"
              onClick={() => (window.location.href = "/auth/naver")}
            >
              <img src="/images/naver.png" alt="Naver Login" />
            </button>
            <button
              type="button"
              className="google"
              onClick={() => (window.location.href = "/auth/google")}
            >
              <img src="/images/google.png" alt="Google Login" />
            </button>
            <button
              type="button"
              className="kakao"
              onClick={() => (window.location.href = "/auth/kakao")}
            >
              <img src="/images/kakao.png" alt="Kakao Login" />
            </button>
          </div>
          {responseMessage && <span>{responseMessage}</span>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
