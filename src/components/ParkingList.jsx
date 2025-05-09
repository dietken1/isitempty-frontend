import React, { useEffect, useState } from "react";
import styles from "./ParkingList.module.css";
import { calculateFee } from "../utils/parkingUtils";

const ParkingList = ({
  parkingLots,
  visible,
  mapRef,
  onClose,
  onSelectLot,
}) => {
  const [sortType, setSortType] = useState("distance");
  const [sortedLots, setSortedLots] = useState([]);
  const [parkingTime, setParkingTime] = useState(null);
  const [hourInput, setHourInput] = useState("");
  const [minuteInput, setMinuteInput] = useState("");

  useEffect(() => {
    if (!parkingLots) return;

    const sorted = [...parkingLots].map((lot) => {
      const totalFee =
        parkingTime !== null ? calculateFee(lot, parkingTime) : null;
      const numericFee =
        totalFee === "무료" || totalFee === "0원"
          ? 0
          : parseInt(totalFee?.replace("원", ""), 10) || Infinity;

      return { ...lot, totalFee, numericFee };
    });

    if (sortType === "distance") {
      sorted.sort(
        (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
      );
    } else if (sortType === "fee") {
      sorted.sort(
        (a, b) => (a.numericFee ?? Infinity) - (b.numericFee ?? Infinity)
      );
    } else if (sortType === "rating") {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    setSortedLots(sorted);
  }, [parkingLots, sortType, parkingTime]);

  const handleApplyTime = () => {
    const hours = parseInt(hourInput, 10) || 0;
    const minutes = parseInt(minuteInput, 10) || 0;
    const total = hours * 60 + minutes;

    if (total <= 0) {
      alert("올바른 시간을 입력하세요.");
      return;
    }

    setParkingTime(total);
  };

  const handleClick = (lot) => {
    const position = new window.kakao.maps.LatLng(lot.latitude, lot.longitude);
    mapRef.current.setCenter(position);
    mapRef.current.setLevel(5);
    onClose();
    onSelectLot(lot);
  };

  if (!visible) return null;

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <div className={styles.header_left}>
          <input
            type="number"
            placeholder="시간"
            value={hourInput}
            onChange={(e) => setHourInput(e.target.value)}
          />
          <span>시간</span>
          <input
            type="number"
            placeholder="분"
            value={minuteInput}
            onChange={(e) => setMinuteInput(e.target.value)}
          />
          <span>분</span>
          <button onClick={handleApplyTime}>적용</button>
        </div>
        <div className={styles.header_right}>
          <button
            className={sortType === "distance" ? styles.active : ""}
            onClick={() => setSortType("distance")}
          >
            거리순
          </button>
          |
          <button
            className={sortType === "fee" ? styles.active : ""}
            onClick={() => setSortType("fee")}
          >
            요금순
          </button>
          |
          <button
            className={sortType === "rating" ? styles.active : ""}
            onClick={() => setSortType("rating")}
          >
            별점순
          </button>
        </div>
        <i
          className="ri-close-line"
          onClick={onClose}
          style={{ cursor: "pointer", fontSize: "20px" }}
        ></i>
      </div>

      <ol className={styles.list}>
        {sortedLots.map((lot, idx) => (
          <li
            key={idx}
            className={styles.item}
            onClick={() => handleClick(lot)}
          >
            <strong>{lot.name}</strong>
            {lot.totalFee && <> - 요금: {lot.totalFee}</>}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ParkingList;
