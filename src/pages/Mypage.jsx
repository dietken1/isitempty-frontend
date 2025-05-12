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

  const handleClick = async (item) => {
  console.log("▶ 클릭한 아이템:", item);
  try {
    if (typeof onClose !== 'function' || typeof onSelectLot !== 'function') {
      console.error("onClose 또는 onSelectLot가 함수가 아닙니다.", { onClose, onSelectLot });
      return;
    }

    // 1) item.parkingLot이 이미 객체라면 바로 전달
    if (item && item.parkingLot && typeof item.parkingLot === 'object') {
      onClose();
      onSelectLot(item.parkingLot);
      return;
    }

    // 2) parkingLotId만 있을 때 API 호출
    if (item && (item.parkingLotId || item.id)) {
      const parkingLotId = item.parkingLotId || item.id;
      const lotData = await getParkingLotById(parkingLotId);
      onClose();
      onSelectLot(lotData);
      return;
    }

    console.error("주차장 정보가 없습니다:", item);
    alert("주차장 정보를 가져오는 데 실패했습니다.");
  } catch (err) {
    console.error("handleClick 내부 에러:", err);
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
        
        // parkingLot 객체가 있는지 확인하고 주차장 정보 추출
        if (fav.parkingLot && fav.parkingLot.name) {
          return {
            id: fav.id,
            parkingLotId: fav.parkingLot.id,
            parkingLotName: fav.parkingLot.name,
            parkingLot: fav.parkingLot  // 전체 주차장 객체 저장
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
              onClick={() => handleClick(p)}
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
              onClick={() => handleClick(r)}
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
