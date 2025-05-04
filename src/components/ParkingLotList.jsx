import React from "react";
import styles from "./ParkingLotList.module.css";

const ParkingLotList = ({ parkingLots, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className={styles.listContainer}>
      <button className={styles.closeBtn} onClick={onClose}>
        닫기
      </button>
      <ul className={styles.list}>
        {parkingLots.map((lot, idx) => (
          <li key={idx} className={styles.item}>
            {lot.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParkingLotList;
