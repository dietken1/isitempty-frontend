import axios from "axios";
import { TokenLocalStorageRepository } from "../repository/localstorages";

export const refreshToken = async () => {
  try {
    const response = await axios.get(`/api/v1/auth/refresh`, {
      withCredentials: true,
    });

    const { token } = response.data;

    if (!token) {
      throw new Error("서버에서 토큰을 반환하지 않았습니다.");
    }

    TokenLocalStorageRepository.setToken({ token });
    return token;
  } catch (err) {
    console.error("refreshToken 실패:", err);
    throw err;
  }
};
