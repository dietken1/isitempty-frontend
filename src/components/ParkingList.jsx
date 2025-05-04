import React from "react";
import styles from "./ParkingList.module.css";

const ParkingList = ({ parkingLots, visible, mapRef }) => {
  if (!visible) return null;

  const handleClick = (lot) => {
    const position = new window.kakao.maps.LatLng(lot.latitude, lot.longitude);
    mapRef.current.setCenter(position);
    mapRef.current.setLevel(5);
  };

  return (
    <div className={styles.listContainer}>
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
