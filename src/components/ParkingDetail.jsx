import React, { useState, useEffect } from "react";
import styles from "./ParkingDetail.module.css";
import { getDistanceFromLatLonInKm } from "../utils/geo.js";
import {
  getParkingReviews,
  createReview,
  deleteReview,
  updateReview,
  getUserFavorites,
  addFavoriteParking,
  removeFavoriteParking,
  getUserMe,
} from "../api/apiService";
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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
  if (!lot) return;

  let mounted = true;
  const init = async () => {
    const token = TokenLocalStorageRepository.getToken();
    if (!token) {
      setIsLoggedIn(false);
      setIsFavorite(false);
      setCurrentUser(null);
      return;
    }
    setIsLoggedIn(true);

    try {
      const { data: me } = await getUserMe();
      if (!mounted) return;
      setCurrentUser(me.username);
      const favs = await getUserFavorites();
      if (!mounted) return;
      const mine = favs.some(f => String(f.parkingLotId) === String(lot.id));
      setIsFavorite(mine);
    } catch (err) {
      console.error("초기화 실패:", err);
    }
  };

  init();

  return () => {
    mounted = false;
  };
}, [lot]);


  useEffect(() => {
    if (!lot) return;

    // 거리 계산
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!lot || !lot.latitude || !lot.longitude) return;

        const dist = getDistanceFromLatLonInKm(
          coords.latitude,
          coords.longitude,
          lot.latitude,
          lot.longitude
        );
        if (!isNaN(dist)) setDistance(dist.toFixed(2));
        else setDistance("계산 불가");
      },
      (err) => {
        console.error("위치 정보 가져오기 실패:", err);
        setDistance("위치 정보 없음");
      }
    );

    // 리뷰 로드
    const fetchReviews = async () => {
      if (!lot.id) return;

      setIsLoadingReviews(true);
      setReviewError(null);

      try {
        const reviewsData = await getParkingReviews(lot.id);
        if (!Array.isArray(reviewsData)) {
          throw new Error("리뷰 형식 오류");
        }
        setReviews(reviewsData);
        if (reviewsData.length === 0) {
          setReviewError("첫 리뷰를 작성해보세요!");
        }
      } catch (error) {
        console.error("리뷰 불러오기 실패:", error);
        setReviewError(
          error.message.includes("401")
            ? "로그인 후 리뷰를 볼 수 있습니다."
            : "리뷰 로드 중 오류가 발생했습니다."
        );
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [lot]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말 리뷰를 삭제하시겠습니까?")) return;
    try {
      await deleteReview(reviewId);
      setReviews((rs) => rs.filter((r) => r.id !== reviewId));
    } catch {
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  const handleEditReview = async (reviewId, content, rating) => {
    const newContent = window.prompt("리뷰 내용을 수정하세요:", content);
    if (newContent == null) return;
    try {
      await updateReview(reviewId, newContent, rating);
      setReviews((rs) =>
        rs.map((r) => (r.id === reviewId ? { ...r, content: newContent } : r))
      );
    } catch {
      alert("리뷰 수정에 실패했습니다.");
    }
  };

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

  const handleHeartClick = async () => {
  if (!isLoggedIn) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  setIsFavorite(prev => !prev);

  try {
    if (isFavorite) {
      await removeFavoriteParking(lot.id);
      alert("찜이 취소되었습니다.");
    } else {
      await addFavoriteParking(lot.id);
      alert("찜이 추가되었습니다.");
    }
  } catch (err) {
    setIsFavorite(prev => !prev);
    console.error("찜 토글 에러:", err);
    alert("찜 처리에 실패했습니다.");
  }
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
      if (error.message.includes("401")) {
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
          <p style={{ color: "#666", marginBottom: "10px" }}>
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
                opacity: isLoggedIn ? 1 : 0.5,
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
                    <span>
                      {" "}
                      - {review.rating}
                      <i className="ri-star-fill"></i>
                    </span>
                    <small>
                      {" "}
                      ({new Date(review.createdAt).toLocaleDateString()})
                    </small>
                    {currentUser === review.user && (
                      <span className={styles.reviewActions}>
                        <button
                          className={styles.buttonEdit}
                          onClick={() =>
                            handleEditReview(
                              review.id,
                              review.content,
                              review.rating
                            )
                          }
                        >
                          수정
                        </button>
                        <button
                          className={styles.buttonDelete}
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          삭제
                        </button>
                      </span>
                    )}
                  </p>
                  <p>{review.content}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ParkingDetail;
