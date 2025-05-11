import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { getMyReviews, getUserFavorites, getUserDetails, getParkingLotById } from "../api/apiService"; 
import { TokenLocalStorageRepository } from "../repository/localstorages";

import './Mypage.css';

const MyPage = ({onClose, onSelectLot}) => {
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
      loadLikedParking();
    }
  }, []);

  const loadUserDetails = () => {
    getUserDetails()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error("Error loading user data:", error));
  };
  
  const loadReviews = async () => {
  try {
    const { reviews = [] } = await getMyReviews();

    const enriched = await Promise.all(
      reviews.map(async (rev) => {
        try {
          const lotResp = await getParkingLotById(rev.parkingLotId);
          console.log("lotResp:", lotResp);
          return { parkingLotName: lotResp.name || lotResp.data?.name || lotResp.parkingLot?.name || "Unknown", };
        } catch (e) {
          console.error(`주차장(${rev.parkingLotId}) 조회 실패:`, e);
          return { ...rev, parkingLotName: `${rev.parkingLotId}` };
        }
      })
    );

    setMyReviews(enriched);
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
};

  const handleClick = async (parkingLotId) => {
      try {
        const lot = await getParkingLotById(parkingLotId);
        onClose();               // MyPage 닫고
        onSelectLot(lot);        // 부모(map) 로 lot 전달
      } catch (err) {
        console.error(err);
        alert("주차장 정보를 가져오는 데 실패했습니다.");
      }
    };

  const loadLikedParking = () => {
    getUserFavorites()
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
          likedParking.map(p => (
            <div
              key={p.id}
              className="liked-item"
              onClick={() => handleClick(p.parkingLotId)}
            >
              <strong><i className="ri-parking-box-fill"></i> {p.name}</strong>
              <hr />
            </div>
          ))
        ) : (
          <p>좋아요한 주차장이 없습니다.</p>
        )}
      </div>

      <div id="myreview" className="myreview">
        {myReviews.length > 0 ? (
          myReviews.map(r => (
            <div
              key={r.id}
              className="review-item"
              onClick={() => handleClick(r.parkingLotId)}
            >
              <p>
                <i className="ri-parking-box-fill"></i>&nbsp;
                <strong>{r.parkingLotName}</strong>
              </p>
              <p><i className="ri-star-fill"></i> {r.rating}</p>
              {r.content && <p className="content">{r.content}</p>}
            </div>
          ))
        ) : (
          <p>작성한 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default MyPage;
