import React, { useState } from 'react';
import './Mypage.css';
import { Link } from 'react-router-dom';

const Mypage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('favorite');
  const reviews = [];
  const likedParking = [];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mypage-container">
      <div className="mypage-h1">
        <h1>MY PAGE</h1>
        <Link to={`/mypage_detail/${user.id}`}><i className="ri-user-settings-line"></i></Link>
      </div>

      <div className="profile">
        <div className="profile_img">
          <img src="/images/profile.png" alt="Profile" />
        </div>
        <div className="profile_name">
          <p>{user.email}</p>
          <p>ID: {user.username}</p>
        </div>
      </div>

      <div className="mypage">
        <div className={`mypage_heart ${activeTab === 'favorite' ? 'active' : ''}`}>
          <button onClick={() => handleTabClick('favorite')}>FAVORITE</button>
        </div>
        <div className={`mypage_review ${activeTab === 'myreview' ? 'active' : ''}`}>
          <button onClick={() => handleTabClick('myreview')}>MY REVIEW</button>
        </div>
      </div>

      {/* 탭별 내용 */}
      {activeTab === 'favorite' && (
        <div id="favorite" className="favorite">
          <p>Favorite</p>
          {likedParking.length === 0 ? (
            <p>좋아요한 주차장이 없습니다.</p>
          ) : (
            likedParking.map((parking) => (
              <div key={parking.id} className="liked-item" onClick={() => window.location.href = `/map/?parking_id=${parking.id}`}>
                <strong><i className="ri-parking-box-fill"></i> {parking.name}</strong>
                <hr />
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'myreview' && (
        <div id="myreview" className="myreview">
          <p>My Review</p>
          {reviews.length === 0 ? (
            <p>리뷰가 없습니다.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item" onClick={() => window.location.href = `/map/?parking_id=${review.parking_lot__id}`}>
                <p><strong><i className="ri-parking-box-fill"></i> {review.parking_lot__name}</strong></p>
                <strong><i className="ri-user-fill"></i> {review.user__username}</strong>
                <span><i className="ri-star-fill"></i> {review.rating}</span>
                <p>{review.content || ''}</p>
                <hr />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Mypage;
