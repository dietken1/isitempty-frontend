import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { TokenLocalStorageRepository } from "../repository/localstorages";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = TokenLocalStorageRepository.getToken();
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener("login", checkLoginStatus);
    window.addEventListener("logout", checkLoginStatus);

    return () => {
      window.removeEventListener("login", checkLoginStatus);
      window.removeEventListener("logout", checkLoginStatus);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (page) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate(page);
    }, 1000);
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
          <a href="/">IsItEmpty</a>
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
            <li onClick={handleLogout}>
              <a>Logout</a>
            </li>
          ) : (
            <li
              onClick={() => {
                navigate("/login");
              }}
            >
              <a>Login</a>
            </li>
          )}
          <li onClick={() => handleMenuClick("/mypage")}>
            <a href="/mypage">Mypage</a>
          </li>
          <li onClick={() => handleMenuClick("/about")}>
            <a href="/about">About</a>
          </li>
          <li onClick={() => handleMenuClick("/contact")}>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
