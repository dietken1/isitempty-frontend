import React from "react";
import styles from "./ParkingDetail.module.css";

const ParkingDetail = ({ lot, onClose, onBackToList }) => {
  if (!lot) return null;

  const {
    name,
    feeInfo,
    address,
    latitude,
    longitude,
    phone,
    type,
    openDays,
    slotCount,
    availableSpots,
  } = lot;

  const availableText =
    availableSpots === null || availableSpots === undefined
      ? `전체자리: ${slotCount}`
      : `남은자리/전체자리: ${availableSpots}/${slotCount}`;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <i
          className="ri-arrow-go-back-line"
          onClick={onBackToList}
          style={{ cursor: "pointer", fontSize: "16px", marginRight: "10px" }}
        ></i>
        <i
          className="ri-close-line"
          onClick={onClose}
          style={{ cursor: "pointer", fontSize: "20px" }}
        ></i>
      </div>
      <div className={styles.detail_header}>
        <h3>{name}</h3>
        <span>{feeInfo} 주차장</span>
      </div>
      <div className={styles.detail_info}>
        <p>
          <i style={{ marginRight: "5px" }} class="ri-map-pin-2-fill"></i>주소:{" "}
          <span>{address}</span>
        </p>
        <p>
          <i style={{ marginRight: "5px" }} class="ri-car-fill"></i>주차장 유형:{" "}
          <span>{type || "정보 없음"}</span>
        </p>
        <p>
          <i style={{ marginRight: "5px" }} class="ri-time-line"></i>영업일:{" "}
          <span>{openDays || "정보 없음"}</span>
        </p>
        <p>
          <i style={{ marginRight: "5px" }} class="ri-parking-box-fill"></i>
          <span>{availableText}</span>
        </p>
        <p>
          <i style={{ marginRight: "5px" }} class="ri-phone-fill"></i>전화번호:{" "}
          <span>{phone || "정보 없음"}</span>
        </p>
      </div>
    </div>
  );
};

export default ParkingDetail;
