import React, { useState, useEffect } from "react";
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
    setIsMenuOpen(prev => !prev);
  };

  const handleMenuClick = (page) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate(page);
    }, 300);
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
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>

      <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
        <ul>
          {isLoggedIn ? (
            <>
              <li>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleMenuClick("/mypage")}>
                  Mypage
                </button>
              </li>
            </>
          ) : (
            <li>
              <button type="button" onClick={() => handleMenuClick("/login")}>
                Login
              </button>
            </li>
          )}
          <li>
            <button type="button" onClick={() => handleMenuClick("/about")}>
              About
            </button>
          </li>
          <li>
            <button type="button" onClick={() => handleMenuClick("/contact")}>
              Contact
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
