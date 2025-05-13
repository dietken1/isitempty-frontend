import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getMyReviews,
  getUserFavorites,
  getUserDetails,
  getParkingLotById,
} from "../api/apiService";
import { TokenLocalStorageRepository } from "../repository/localstorages";
import ParkingDetail from "../components/ParkingDetail";

import "./Mypage.css";

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
    const res = await getMyReviews();
    console.log("리뷰 API 응답:", res);

    // 응답 형태에 맞춰 rawReviews 추출
    const rawReviews = Array.isArray(res)
      ? res
      : Array.isArray(res.reviews)
        ? res.reviews
        : Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.reviews)
            ? res.data.reviews
            : [];

    if (!rawReviews.length) {
      console.log("리뷰가 없습니다");
      setMyReviews([]);
      return;
    }

    // 주차장 이름까지 붙여 주는 부분
    const enriched = await Promise.all(
      rawReviews.map(async (rev) => {
        let lotObj = null;
        try {
          const lotResp = await getParkingLotById(rev.parkingLotId);
          lotObj =
            lotResp.parkingLot ??
            lotResp.data?.parkingLot ??
            lotResp.data ??
            lotResp;
        } catch (e) {
          console.warn("주차장 조회 실패:", e);
        }
        return {
          id: rev.id,
          parkingLotId: rev.parkingLotId,
          parkingLotName: lotObj?.name || "알 수 없는 주차장",
          rating: rev.rating || 0,
          content: rev.content || "",
          parkingLot: lotObj,
        };
      })
    );

    console.log("가공된 리뷰 데이터:", enriched);
    setMyReviews(enriched);
  } catch (err) {
    console.error("리뷰 목록 불러오기 실패:", err);
    setMyReviews([]);
  }
};
  const handleClick = async (item) => {
    // item.parkingLot이 있으면 바로, 없으면 API로 가져와서…
    const lot = item.parkingLot || (await getParkingLotById(item.parkingLotId));
    navigate("/map", { state: { selectedParkingLot: lot } });
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
            parkingLot: fav.parkingLot, // 전체 주차장 객체 저장
          };
        }

        // parkingLot이 없거나 name이 없는 경우 기본값 설정
        return {
          id: fav.id || Math.random().toString(36).substr(2, 9),
          parkingLotId: fav.parkingLotId,
          parkingLotName: "알 수 없는 주차장",
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
    document.getElementById("favorite").classList.toggle("active");
    document.getElementById("myreview").classList.remove("active");
  };

  const toggleMyReview = () => {
    document.getElementById("myreview").classList.toggle("active");
    document.getElementById("favorite").classList.remove("active");
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
            <a href="#" onClick={toggleFavorite}>
              FAVORITE
            </a>
          </div>
          <div className="mypage_review">
            <a href="#" onClick={toggleMyReview}>
              MY REVIEW
            </a>
          </div>
        </div>

        <div id="favorite" className="favorite">
          {likedParking.length > 0 ? (
            likedParking.map((p) => (
              <div
                key={p.id}
                className="liked-item"
                onClick={() => handleClick(p)}
              >
                <strong>
                  <i className="ri-parking-box-fill"></i>{" "}
                  {p.parkingLot?.name || p.parkingLotName}
                </strong>
                <br />
              </div>
            ))
          ) : (
            <p>좋아요한 주차장이 없습니다.</p>
          )}
        </div>

        <div id="myreview" className="myreview">
          {myReviews.length > 0 ? (
            myReviews.map((r) => (
              <div
                key={r.id}
                className="review-item"
                onClick={() => handleClick(r)}
              >
                <p>
                  <i className="ri-parking-box-fill"></i>&nbsp;
                  <strong>{r.parkingLotName}</strong>
                </p>
                <p>
                  <i className="ri-star-fill"></i> {r.rating}
                </p>
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
