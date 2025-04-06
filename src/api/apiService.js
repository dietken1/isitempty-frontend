/**
 * API 서비스 모듈
 * 백엔드 API와의 통신을 담당합니다.
 */
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Hello API 호출
 * @returns {Promise<Object>} - Hello 메시지
 */
export const getHello = async () => {
  try {
    const response = await api.get('/hello');
    return response.data;
  } catch (error) {
    console.error('Error fetching hello:', error);
    throw error;
  }
};

export default {
  getHello,
};
