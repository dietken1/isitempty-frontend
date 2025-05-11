import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { getMyReviews, getUserFavorites, getUserDetails } from "../api/apiService"; 
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
      loadUserDetails();
      loadReviews();
    }
  }, []);

  useEffect(() => {
    if (user && user.username) {
      loadLikedParking();
    }
  }, [user]);

  const loadUserDetails = () => {
    getUserDetails()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error("Error loading user data:", error));
  };
  
  const loadReviews = () => {
    getMyReviews()
      .then((data) => setMyReviews(data.reviews || []))
      .catch((error) => console.error("Error loading reviews:", error));
  };

  const loadLikedParking = () => {
    if (!user || !user.username) return;
    
    getUserFavorites(user.username)
      .then((favorites) => {
        setLikedParking(favorites);
      })
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
        {user && (
          <Link to={`/mypage/${user.id}/edit`}>
            <i className="ri-user-settings-line"></i>
          </Link>
        )}
</div>
        <div className="profile">
          <div className="profile_img">
            <img src="/images/profile.png" alt="Profile" />
          </div>
          <div className="profile_name">
            {user ? (
              <>
                <p>{user.username}</p>
                <p>{user.email}</p>
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
                <Link to={`/parking/${parking.parkingLotId}`}>
                  <strong><i className="ri-parking-box-fill"></i> {parking.name}</strong>
                </Link>
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
