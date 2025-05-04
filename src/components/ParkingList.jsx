import React from "react";
import styles from "./ParkingList.module.css";

const ParkingList = ({
  parkingLots,
  visible,
  mapRef,
  onClose,
  onSelectLot,
}) => {
  if (!visible) return null;

  const handleClick = (lot) => {
    const position = new window.kakao.maps.LatLng(lot.latitude, lot.longitude);
    mapRef.current.setCenter(position);
    mapRef.current.setLevel(5);
    onClose(); // 리스트 닫기
    onSelectLot(lot); // 디테일 페이지 열기
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <i
          className="ri-close-line"
          onClick={onClose}
          style={{ cursor: "pointer", fontSize: "20px" }}
        ></i>
      </div>
      <ol className={styles.list}>
        {parkingLots.map((lot, idx) => (
          <li
            key={idx}
            className={styles.item}
            onClick={() => handleClick(lot)}
          >
            {lot.name}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ParkingList;
