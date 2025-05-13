import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { TokenLocalStorageRepository } from "../repository/localstorages";
import { getUserMe } from "../api/apiService";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = TokenLocalStorageRepository.getToken();
      setIsLoggedIn(!!token);

      // 로그인 상태일 때만 관리자 권한 확인
      if (token) {
        try {
          const response = await getUserMe();
          // Axios 응답에서 data 객체 추출
          const userData = response.data;
          // roleType 확인
          setIsAdmin(userData && userData.roleType === "ADMIN");
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkLoginStatus();

    // 이벤트 리스너 등록
    const handleLoginEvent = () => checkLoginStatus();
    window.addEventListener("login", handleLoginEvent);
    window.addEventListener("logout", handleLoginEvent);

    return () => {
      window.removeEventListener("login", handleLoginEvent);
      window.removeEventListener("logout", handleLoginEvent);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (page) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate(page);
    }, 300); // 1000ms에서 300ms로 변경하여 더 빠른 반응성 제공
  };

  const handleLogout = () => {
    TokenLocalStorageRepository.removeToken();
    window.dispatchEvent(new Event("logout"));
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>
          <a href="/" className="logo-wrapper">
            <img src="/images/logo.png" alt="IsItEmpty" className="logo" />
          </a>
        </h1>
      </div>

      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
        <ul>
          {isLoggedIn ? (
            <>
              <li onClick={handleLogout}>
                <a>Logout</a>
              </li>
              <li onClick={() => handleMenuClick("/mypage")}>
                <a>Mypage</a>
              </li>
              {isAdmin && (
                <li
                  onClick={() => handleMenuClick("/admin")}
                  className="admin-menu"
                >
                  <a>Admin</a>
                </li>
              )}
            </>
          ) : (
            <li onClick={() => handleMenuClick("/login")}>
              <a>Login</a>
            </li>
          )}
          <li onClick={() => handleMenuClick("/about")}>
            <a>About</a>
          </li>
          <li onClick={() => handleMenuClick("/contact")}>
            <a>Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
