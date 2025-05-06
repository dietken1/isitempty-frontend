import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate("/map");
  };

  return (
    <div className="home-container">
      <h1>Welcome to IsItEmpty</h1>
      <div className="maptest">
        <button onClick={goToMap} className="map-button">
          🗺️ Open Map
        </button>
      </div>
      <div className="card">
        <h4><i className="ri-parking-box-fill"></i>실시간 정보</h4>
        <p>실시간으로 주차장에 빈자리가 있는지 확인하세요!</p>
      </div>

      <div className="card">
        <h4><i className="ri-camera-fill"></i>단속 카메라</h4>
        <p>주차 단속 카메라가 어디있는지 확인하세요!</p>
      </div>

      <div className="card">
        <h4><i className="ri-men-line"></i>
        <i className="ri-women-line"></i>화장실</h4>
        <p>운전중 급하다면? 화장실이 어디있는지 확인하세요!</p>
      </div>

      
    </div>
  );
}

export default Home;
