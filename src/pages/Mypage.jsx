import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { getMyReviews, getFavoriteParking, getUserDetails } from "../api/apiService"; 
import { TokenLocalStorageRepository } from "../repository/localstorages";

import './Mypage.css';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [likedParking, setLikedParking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = TokenLocalStorageRepository.getToken();
    if (!token) {
      navigate("/login");
    } else {
      loadUserDetails(token);
      loadReviews(token);
      loadLikedParking(token);
    }
  }, []);

  const loadUserDetails = (token) => {
    console.log(token);
    getUserDetails(token) // 토큰을 API에 보내서 유저 정보 불러오기
      .then((data) => {
        setUser(data); // 상태 업데이트
        console.log(data); // 데이터 콘솔 출력
      })
      .catch((error) => console.error("Error loading user data:", error));
  };
  

  const loadReviews = (token) => {
    getMyReviews(token) // 토큰을 API에 보내서 리뷰 목록 불러오기
      .then((data) => setMyReviews(data.reviews || []))
      .catch((error) => console.error("Error loading reviews:", error));
  };

  const loadLikedParking = (token) => {
    getFavoriteParking(token)
      .then((data) => setLikedParking(data.liked_parking_lots || []))
      .catch((error) => console.error("Error loading liked parking:", error));
  };

  const toggleFavorite = () => {
    document.getElementById('favorite').classList.toggle('active');
    document.getElementById('myreview').classList.remove('active');
  };

  const toggleMyReview = () => {
    document.getElementById('myreview').classList.toggle('active');
    document.getElementById('favorite').classList.remove('active');
  };

  return (
    <div className="mypage-container">
      <div className="mypage_container">
        <div className="mypage-h1">
          <h1>MY PAGE</h1>
        </div>

        {user && (
          <Link to={`/mypage/${user.id}/edit`}>
            <i className="ri-user-settings-line"></i>
          </Link>
        )}

        <div className="profile">
          <div className="profile_img">
            <img src="/public/images/profile.png" alt="Profile" />
          </div>
          <div className="profile_name">
            {user ? (
              <>
                <p>{user.email}</p>
                <p>ID: {user.username}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>

        <div className="mypage">
          <div className="mypage_heart">
            <a href="#" onClick={toggleFavorite}>FAVORITE</a>
          </div>
          <div className="mypage_review">
            <a href="#" onClick={toggleMyReview}>MY REVIEW</a>
          </div>
        </div>

        <div id="favorite" className="favorite">
          {likedParking.length > 0 ? (
            likedParking.map((parking) => (
              <div key={parking.id} className="liked-item">
                <strong><i className="ri-parking-box-fill"></i> {parking.name}</strong>
                <hr />
              </div>
            ))
          ) : (
            <p>좋아요한 주차장이 없습니다.</p>
          )}
        </div>

        <div id="myreview" className="myreview">
          <div className="review-list">
            {myReviews.length > 0 ? (
              myReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <p><strong><i className="ri-parking-box-fill"></i> {review.parking_lot__name}</strong></p>
                  <strong><i className="ri-user-fill"></i> {review.user__username}</strong>
                  <span><i className="ri-star-fill"></i> {review.rating}</span>
                  <p>{review.content || ''}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>작성한 리뷰가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
