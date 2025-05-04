import React from "react";
import styles from "./ParkingDetail.module.css";

const ParkingDetail = ({ lot, onClose }) => {
  if (!lot) return null;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <i
          className="ri-close-line"
          onClick={onClose}
          style={{ cursor: "pointer", fontSize: "20px" }}
        ></i>
      </div>
      <h3>{lot.name}</h3>
      <p>주소: {lot.address}</p>
      <p>위도: {lot.latitude}</p>
      <p>경도: {lot.longitude}</p>
    </div>
  );
};

export default ParkingDetail;
