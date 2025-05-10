/**
 * API 서비스 모듈
 * 백엔드 API와의 통신을 담당합니다.
 */
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { TokenLocalStorageRepository } from "../repository/localstorages";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    const response = await fetch("/api/parking-lots/nearby", {
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
  const response = await fetch("/api/camera/nearby", {
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
    const response = await fetch("/api/toilet/nearby", {
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
    const response = await fetch("/api/myreviews", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getFavoriteParking = async () => {
  try {
    const token = TokenLocalStorageRepository.getToken();
    const response = await fetch("/api/favorites", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching favorite parking:", error);
    throw error;
  }
};

export const getUserDetails = async () => {
  try {
    const token = TokenLocalStorageRepository.getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("/api/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const data = await response.json();
    return data;
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

    const response = await fetch("/api/v1/users/update", {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in updateUserDetails:", error);
    throw error;
  }
};

// 위도 경도 넘겨서 거리 포함 모든 주차장 불러오기 (거리 기준 정렬용)
export const fetchParkingLotsWithDistance = async (latitude, longitude) => {
  try {
    const response = await fetch("/api/parking-lots/all-with-distance", {
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
  return fetch("/api/question", {
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
    // 다양한 가능한 경로 시도를 위한 로깅
    console.log(`getParkingReviews 호출: parkingLotId=${parkingLotId}, 타입=${typeof parkingLotId}`);
    
    // API 경로를 문자열 ID로 확실하게 변환
    const id = String(parkingLotId);
    console.log(`변환된 ID: ${id}`);
    
    // 백엔드 엔드포인트와 일치하는지 확인
    const response = await axios.get(`/api/reviews/parkingLot/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TokenLocalStorageRepository.getToken()}`
      }
    });
    
    console.log('리뷰 데이터 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching parking reviews:", error);
    if (error.response) {
      console.log("응답 상태:", error.response.status);
      console.log("응답 데이터:", error.response.data);
      console.log("요청 URL:", error.config.url);
    } else if (error.request) {
      console.log("요청이 전송되었으나 응답이 없음:", error.request);
    } else {
      console.log("요청 설정 중 오류:", error.message);
    }
    
    // 임시로 빈 배열 반환하여 UI가 깨지지 않게 함
    console.log("빈 리뷰 배열 반환");
    return [];
    
    // 원래 오류 처리
    // throw new Error(`Failed to fetch parking reviews: ${error.message}`);
  }
};

export const createReview = async (parkingLotId, content, rating) => {
  try {
    console.log(`createReview 호출: parkingLotId=${parkingLotId}, rating=${rating}`);
    const response = await axios.post("/api/reviews", {
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