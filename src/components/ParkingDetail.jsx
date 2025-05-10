import React, { useState, useEffect } from "react";
import styles from "./ParkingDetail.module.css";
import { getDistanceFromLatLonInKm } from "../utils/geo.js";
import { getParkingReviews, createReview } from "../api/apiService";
import { TokenLocalStorageRepository } from "../repository/localstorages";

const ParkingDetail = ({ lot, onClose, onBackToList }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [distance, setDistance] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = TokenLocalStorageRepository.getToken();
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    // 토큰이 변경될 때마다 로그인 상태를 다시 확인
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    if (!lot) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        const dist = getDistanceFromLatLonInKm(
          userLat,
          userLon,
          lot.latitude,
          lot.longitude
        );

        setDistance(dist.toFixed(2)); // km 단위, 소수점 둘째자리까지
      },
      (err) => {
        console.error("위치 정보 가져오기 실패:", err);
        setDistance("위치 정보 없음");
      }
    );

    // 리뷰 데이터 가져오기
    const fetchReviews = async () => {
      if (!lot.id) return;
      
      setIsLoadingReviews(true);
      setReviewError(null);
      
      try {
        const reviewsData = await getParkingReviews(lot.id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("리뷰 불러오기 실패:", error);
        if (error.message.includes('401')) {
          setReviewError("리뷰를 보려면 로그인이 필요합니다.");
        } else {
          setReviewError("리뷰를 불러오는데 실패했습니다.");
        }
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [lot]);

  if (!lot) return null;

  const {
    name,
    feeInfo,
    address,
    phone,
    type,
    openDays,
    slotCount,
    availableSpots,
  } = lot;

  const handleHeartClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleReviewChange = (e) => {
    setReviewContent(e.target.value);
  };

  const handleReviewSubmit = async () => {
    if (!isLoggedIn) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.");
      return;
    }

    if (!selectedRating) {
      alert("별점을 선택해주세요.");
      return;
    }
    
    if (!reviewContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      await createReview(lot.id, reviewContent, selectedRating);
      const updatedReviews = await getParkingReviews(lot.id);
      setReviews(updatedReviews);
      
      setReviewContent("");
      setSelectedRating(0);
      
      alert("리뷰가 등록되었습니다.");
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      if (error.message.includes('401')) {
        alert("로그인이 필요합니다.");
      } else {
        alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <p>
          <i className="ri-road-map-line"></i> 현재 위치로부터{" "}
          <span>{distance ?? "계산 중..."}km</span>
        </p>
        <div>
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
          {availableSpots === null || availableSpots === undefined ? (
            <>
              <span className={styles.spot}>전체자리: </span>
              <span>{slotCount}</span>
            </>
          ) : (
            <>
              <span className={styles.spot}>남은자리/전체자리: </span>
              <span>
                {availableSpots}/{slotCount}
              </span>
            </>
          )}
        </p>
        <p>
          <i style={{ marginRight: "5px" }} className="ri-phone-fill"></i>
          전화번호: <span>{phone || "정보 없음"}</span>
        </p>
      </div>

      <div className={styles.ratingContainer}>
        {!isLoggedIn && (
          <p style={{ color: '#666', marginBottom: '10px' }}>
            리뷰를 작성하려면 로그인이 필요합니다.
          </p>
        )}
        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`ri-star-line ${
                star <= selectedRating ? "ri-star-fill" : ""
              }`}
              onClick={() => isLoggedIn && handleRatingClick(star)}
              style={{
                cursor: isLoggedIn ? "pointer" : "not-allowed",
                fontSize: "24px",
                color: star <= selectedRating ? " #ffe200" : "black",
                opacity: isLoggedIn ? 1 : 0.5
              }}
            ></i>
          ))}
        </div>
      </div>

      {isLoggedIn && (
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
      )}

      <div className={styles.reviewsList}>
        <details>
          <summary>리뷰 보기</summary>
          <div className={styles.reviews}>
            {isLoadingReviews ? (
              <p>리뷰를 불러오는 중...</p>
            ) : reviewError ? (
              <p className={styles.error}>{reviewError}</p>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className={styles.reviewItem}>
                  <p>
                    <strong>{review.user}</strong>
                    <span> - {review.rating}<i className="ri-star-fill"></i></span>
                  </p>
                  <p>{review.content}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>리뷰가 없습니다.</p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ParkingDetail;
