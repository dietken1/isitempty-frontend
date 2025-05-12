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
  }, [navigate]);

  const loadUserDetails = () => {
    getUserDetails()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error("Error loading user data:", error));
  };
  
  const loadReviews = async () => {
    try {
      const reviewsData = await getMyReviews();
      console.log("리뷰 데이터:", reviewsData);
      
      // reviewsData가 객체이고 reviews 속성을 가지고 있는지 확인
      const reviews = reviewsData && reviewsData.reviews ? reviewsData.reviews : [];
      
      console.log("처리할 리뷰 목록:", reviews);
      
      if (!reviews.length) {
        console.log("리뷰가 없습니다");
        setMyReviews([]);
        return;
      }

      const enriched = reviews.map((rev) => {
        console.log("리뷰 항목:", rev);
        
        // parkingLot 객체가 있는지 확인하고 주차장 이름 추출
        if (rev.parkingLot && rev.parkingLot.name) {
          return {
            id: rev.id,
            parkingLotId: rev.parkingLot.id,
            parkingLotName: rev.parkingLot.name,
            rating: rev.rating || 0,
            content: rev.content || ""
          };
        }
        
        // parkingLot이 없거나 name이 없는 경우 기본값 설정
        return { 
          id: rev.id || Math.random().toString(36).substr(2, 9),
          parkingLotId: rev.parkingLotId,
          parkingLotName: "알 수 없는 주차장",
          rating: rev.rating || 0,
          content: rev.content || ""
        };
      });

      console.log("가공된 리뷰 데이터:", enriched);
      setMyReviews(enriched);
    } catch (error) {
      console.error("리뷰 목록 불러오기 실패:", error);
      setMyReviews([]);
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

  const loadLikedParking = async () => {
    try {
      const favs = await getUserFavorites();
      console.log("찜 데이터:", favs);
      
      if (!favs.length) {
        console.log("찜한 주차장이 없습니다");
        setLikedParking([]);
        return;
      }
      
      const enriched = favs.map((fav) => {
        console.log("찜 항목:", fav);
        
        // parkingLot 객체가 있는지 확인하고 주차장 이름 추출
        if (fav.parkingLot && fav.parkingLot.name) {
          return {
            id: fav.id,
            parkingLotId: fav.parkingLot.id,
            parkingLotName: fav.parkingLot.name
          };
        }
        
        // parkingLot이 없거나 name이 없는 경우 기본값 설정
        return { 
          id: fav.id || Math.random().toString(36).substr(2, 9),
          parkingLotId: fav.parkingLotId,
          parkingLotName: "알 수 없는 주차장" 
        };
      });
      
      console.log("가공된 찜 데이터:", enriched);
      setLikedParking(enriched);
    } catch (err) {
      console.error("좋아요한 주차장 불러오기 실패:", err);
      setLikedParking([]);
    }
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
              <strong><i className="ri-parking-box-fill"></i>{p.parkingLotName}</strong> 
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
