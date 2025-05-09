import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails, updateUserDetails } from "../api/apiService"; 
import { TokenLocalStorageRepository } from "../repository/localstorages";

import './EditUserPage.css';

const EditUserPage = () => {
  const { id } = useParams(); // URL 파라미터로 id 가져오기
  console.log("User ID from URL:", id); 
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const [updatedUser, setUpdatedUser] = useState({ email: "", password: "" }); // 수정된 사용자 정보 상태

  useEffect(() => {
    const token = TokenLocalStorageRepository.getToken(); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    } else {
      loadUserDetails(token); // 사용자 정보 불러오기
    }
  }, []); 
  

  const loadUserDetails = (token) => {
    console.log("Requesting user details with token:", token);  
  
    getUserDetails(token) 
      .then((data) => {
        console.log("Fetched user data:", data);
        setUser(data); // 사용자 정보 상태에 저장
        setUpdatedUser({
          email: data.email, // fetched email
          password: data.password, // fetched password
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  const handleSave = () => {
    const token = TokenLocalStorageRepository.getToken(); // 로컬 스토리지에서 토큰 가져오기
    if (!token || !user) {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      return;
    }
  
    // 이메일과 패스워드를 포함한 사용자 정보를 업데이트하는 API 호출
    const userUpdateData = {
      email: updatedUser.email,
      password: updatedUser.password,
    };

    updateUserDetails(token, userUpdateData) // 수정된 사용자 정보 API 호출
      .then((data) => {
        console.log("User information updated:", data);
        navigate(`/mypage/${user.id}`); // 수정 후 마이페이지로 리다이렉트
      })
      .catch((error) => {
        console.error("Error updating user information:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return <p>Loading...</p>; // 사용자 정보가 로드되지 않으면 로딩 상태 표시
  }

  return (
    <div className="edit-user-container">
      <h1>Edit User Info</h1>
      <div>
        <form>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={updatedUser.password}
            onChange={handleChange}
          />
          <br />
          <div className="savebtn">
            <button type="button" onClick={handleSave}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
