import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <button className="footer-button">
          <a href="https://github.com/Isitempty" target="_blank">
            <img
              className="footer-icon"
              src="/images/github.png"
              alt="깃허브"
            ></img>
          </a>
        </button>
        <p>&copy; {new Date().getFullYear()} IsItEmpty. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
