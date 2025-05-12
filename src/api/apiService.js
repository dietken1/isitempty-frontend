/**
 * API 서비스 모듈
 * 백엔드 API와의 통신을 담당합니다.
 */
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { TokenLocalStorageRepository } from "../repository/localstorages";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: `/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 404 에러에 대한 로깅 방지
axios.interceptors.response.use(
  response => response,
  error => {
    // 404 에러는 콘솔에 출력하지 않음
    if (error.response && error.response.status === 404) {
      // 조용히 에러 전파
      return Promise.reject(error);
    }
    // 다른 에러는 그대로 로깅
    return Promise.reject(error);
  }
);

/**
 * Hello API 호출
 * @returns {Promise<Object>} - Hello 메시지
 */
export const getHello = async () => {
  try {
    const response = await api.get("/hello");
    return response.data;
  } catch (error) {
    console.error("Error fetching hello:", error);
    throw error;
  }
};

export default {
  getHello,
};
// 위도 경도 넘겨서 주변 주차장 불러오기
export const fetchNearbyParkingLots = async (lat, lng) => {
  try {
    const response = await fetch(`/api/parking-lots/nearby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      }),
    });

    if (!response.ok) throw new Error("서버 응답 실패");

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("주차장 조회 중 오류 발생:", err);
    throw err;
  }
};
// 위도 경도 넘겨서 주변 카메라 불러오기
export const fetchNearbyCameras = async (latitude, longitude) => {
  const response = await fetch(`/api/camera/nearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!response.ok) throw new Error("Failed to fetch nearby cameras");
  return response.json();
};
// 위도 경도 넘겨서 주변 화장실 불러오기
export const fetchNearbyToilets = async (latitude, longitude) => {
  try {
    const response = await fetch(`/api/toilet/nearby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) throw new Error("Failed to fetch nearby toilets");

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("화장실 조회 중 오류 발생:", err);
    throw err;
  }
};

export const loginUser = (userId, password) =>
  axiosInstance.post("/auth/login", { id: userId, password });

export const getUserMe = () => axiosInstance.get("/users/me");

export const getMyReviews = async () => {
  try {
    const token = TokenLocalStorageRepository.getToken();
    // 사용자 정보 가져오기
    const userResponse = await getUserMe();
    const userId = userResponse.data?.id || userResponse.data?.userId;
    
    if (!userId) {
      throw new Error("사용자 ID를 가져올 수 없습니다.");
    }
    
    // 수정된 API 경로
    const response = await fetch(`/api/reviews/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `리뷰 조회 실패: ${response.status}`);
    }
    
    const data = await response.json();
    return { reviews: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getUserFavorites = async () => {
  try {
    const token = TokenLocalStorageRepository.getToken();
    
    // 사용자 정보 가져오기
    const userResponse = await getUserMe();
    const userId = userResponse.data?.id || userResponse.data?.userId;
    
    if (!userId) {
      throw new Error("사용자 ID를 가져올 수 없습니다.");
    }
    
    const response = await fetch(`/api/favorites/user/${userId}`, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Favorites 조회 실패: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

export const addFavoriteParking = async (parkingLotId) => {
  const token = TokenLocalStorageRepository.getToken();
  const res = await fetch("/api/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ parkingLotId }),
  });

  const text = await res.text();
  console.log("🚀 addFavorite response:", res.status, text);
    if (!res.ok) {
    throw new Error(text);
  }
  return text;
};

export const removeFavoriteParking = async (parkingLotId) => {
  const token = TokenLocalStorageRepository.getToken();
  const res = await fetch(
     `/api/favorites?parkingLotId=${parkingLotId}`,
     {
       method: "DELETE",
       headers: {
         "Authorization": `Bearer ${token}`,
       },
     }
   );
  const text = await res.text();
  console.log("🚀 removeFavorite response:", res.status, text);
   if (!res.ok) {
     throw new Error(text);
   }
 
   return text;
 };

export const getUserDetails = async () => {
  try {
    const response = await getUserMe();
    return response.data;
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
};

export const updateUserDetails = async (userData) => {
  try {
    const token = TokenLocalStorageRepository.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`/api/v1/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user details");
    }

    // 응답 타입 확인
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      // JSON이 아닌 경우 텍스트로 처리
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error("Error in updateUserDetails:", error);
    throw error;
  }
};

// 위도 경도 넘겨서 거리 포함 모든 주차장 불러오기 (거리 기준 정렬용)
export const fetchParkingLotsWithDistance = async (latitude, longitude) => {
  try {
    const response = await fetch(`/api/parking-lots/all-with-distance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error("주차장 거리 정보 불러오기 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching parking lots with distance:", error);
    throw error;
  }
};

export const sendContactMessage = (formData) => {
  return fetch(`/api/question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error submitting form:', error);
      throw error;
    });
};

export const getParkingReviews = async (parkingLotId) => {
  try {
    const res = await axios.get(`/api/reviews/parkingLot/${parkingLotId}`, {
      headers: { Authorization: `Bearer ${TokenLocalStorageRepository.getToken()}` }
    });
    const arr = Array.isArray(res.data) ? res.data : res.data.data || [];
    return arr.map(r => ({
      id: r.id,
      content: r.content,
      rating: r.rating,
      user: r.user.username,
      createdAt: r.createdAt
    }));
  } catch (error) {
    // 404 오류(리뷰가 없는 경우)는 빈 배열 반환 (로그 메시지 간소화)
    if (error.response && error.response.status === 404) {
      // console.log(`주차장(${parkingLotId})의 리뷰가 없습니다.`);
      return [];
    }
    // 로그에 전체 오류 객체 대신 간단한 메시지만 표시
    console.error(`리뷰 불러오기 실패 (${parkingLotId}): ${error.message}`);
    throw error;
  }
};

export const createReview = async (parkingLotId, content, rating) => {
  try {
    console.log(`createReview 호출: parkingLotId=${parkingLotId}, rating=${rating}`);
    const response = await axios.post(`/api/reviews`, {
      parkingLotId,
      content,
      rating
    }, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${TokenLocalStorageRepository.getToken()}`
      }
    });
    
    console.log('리뷰 생성 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.response) {
      console.log("응답 상태:", error.response.status);
      console.log("응답 데이터:", error.response.data);
    }
    throw new Error(`Failed to create review: ${error.message}`);
  }
};

export const updateReview = async (reviewId, content, rating) => {
  try {
    console.log(`updateReview 호출: reviewId=${reviewId}, rating=${rating}`);
    const response = await axios.patch(`/api/reviews/${reviewId}`, {
      content,
      rating
    }, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${TokenLocalStorageRepository.getToken()}`
      }
    });
    
    console.log('리뷰 수정 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    if (error.response) {
      console.log("응답 상태:", error.response.status);
      console.log("응답 데이터:", error.response.data);
    }
    throw new Error(`Failed to update review: ${error.message}`);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    console.log(`deleteReview 호출: reviewId=${reviewId}`);
    const response = await axios.delete(`/api/reviews/${reviewId}`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${TokenLocalStorageRepository.getToken()}`
      }
    });
    
    console.log('리뷰 삭제 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    if (error.response) {
      console.log("응답 상태:", error.response.status);
      console.log("응답 데이터:", error.response.data);
    }
    throw new Error(`Failed to delete review: ${error.message}`);
  }
};

export const getParkingLotById = async (id) => {
  // id가 undefined 또는 null인 경우 빈 객체 반환
  if (!id) {
    console.warn("주차장 ID가 유효하지 않습니다:", id);
    return { name: "알 수 없는 주차장", id: "unknown" };
  }

  const token = TokenLocalStorageRepository.getToken();
  try {
    const res = await fetch(`/api/parking-lots/${id}`, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      }
    });
    
    if (!res.ok) {
      throw new Error(`주차장 조회 실패: ${res.status}`);
    }
    
    // 응답이 비어있는지 확인
    const text = await res.text();
    if (!text || text.trim() === '') {
      return { name: `주차장 #${id}`, id };
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error(`주차장 데이터 파싱 실패 (ID: ${id}):`, parseError);
      return { name: `주차장 #${id}`, id };
    }
  } catch (error) {
    console.error(`주차장(${id}) 조회 실패:`, error.message);
    throw error;
  }
};