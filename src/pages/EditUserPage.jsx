import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails, updateUserDetails } from "../api/apiService"; 
import { TokenLocalStorageRepository } from "../repository/localstorages";

import './EditUserPage.css';

const EditUserPage = () => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({  username: "", email: "", password: "" });

  useEffect(() => {
    const token = TokenLocalStorageRepository.getToken();
    if (!token) {
      navigate("/login");
    } else {
      loadUserDetails();
    }
  }, []); 

  const loadUserDetails = () => {
    getUserDetails()
      .then((data) => {
        console.log("Fetched user data:", data);
        setUser(data);
        setUpdatedUser({
          username: data.username,  
          email: data.email,
          password: data.password,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login");
      });
  };

  const handleSave = async () => {
    const token = TokenLocalStorageRepository.getToken();
    if (!token || !user) {
      return navigate("/login");
    }
  
    const userUpdateData = {
      username: updatedUser.username,
      email: updatedUser.email,
      password: updatedUser.password,
    };
  
    try {
      const response = await updateUserDetails(userUpdateData);
      console.log("User information updated:", response);
      const successMessage = response.message ? response.message : "사용자 정보가 성공적으로 업데이트되었습니다.";
      alert(successMessage);
      navigate("/mypage/");
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("사용자 정보 업데이트 중 오류가 발생했습니다.");
    }
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
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleChange}
          />
          <br />
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
