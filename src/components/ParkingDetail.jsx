import React, { useState } from "react";
import styles from "./ParkingDetail.module.css";

const ParkingDetail = ({ lot, onClose, onBackToList }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");

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

  const handleHeartClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleReviewChange = (e) => {
    setReviewContent(e.target.value);
  };

  const handleReviewSubmit = () => {
    alert(`리뷰 등록: ${reviewContent}, 별점: ${selectedRating}`);
    setReviewContent("");
    setSelectedRating(0);
  };

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
        <i
          className={`ri-heart-line ${isFavorite ? "ri-heart-fill" : ""}`}
          onClick={handleHeartClick}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            color: isFavorite ? "red" : "black",
          }}
        ></i>
      </div>
      <div className={styles.detail_info}>
        <p>
          <i style={{ marginRight: "5px" }} className="ri-map-pin-2-fill"></i>
          주소: <span>{address}</span>
        </p>
        <p>
          <i style={{ marginRight: "5px" }} className="ri-car-fill"></i>주차장
          유형: <span>{type || "정보 없음"}</span>
        </p>
        <p>
          <i style={{ marginRight: "5px" }} className="ri-time-line"></i>영업일:{" "}
          <span>{openDays || "정보 없음"}</span>
        </p>
        <p>
          <i style={{ marginRight: "5px" }} className="ri-parking-box-fill"></i>
          <span>{availableText}</span>
        </p>
        <p>
          <i style={{ marginRight: "5px" }} className="ri-phone-fill"></i>
          전화번호: <span>{phone || "정보 없음"}</span>
        </p>
      </div>

      <div className={styles.ratingContainer}>
        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`ri-star-line ${star <= selectedRating ? "ri-star-fill" : ""}`}
              onClick={() => handleRatingClick(star)}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                color: star <= selectedRating ? " #ffe200" : "black", // 채워진 별은 yellow로 표시
              }}
            ></i>
          ))}
        </div>
      </div>

      <div className={styles.reviewContainer}>
        <textarea
          placeholder="리뷰를 입력하세요"
          value={reviewContent}
          onChange={handleReviewChange}
          className={styles.reviewTextarea}
        ></textarea>
        <button className={styles.reviewBtn} onClick={handleReviewSubmit}>
          리뷰 등록
        </button>
      </div>
    </div>
  );
};

export default ParkingDetail;
