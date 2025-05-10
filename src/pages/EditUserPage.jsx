import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails, updateUserDetails } from "../api/apiService"; 
import { TokenLocalStorageRepository } from "../repository/localstorages";

import './EditUserPage.css';

const EditUserPage = () => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = TokenLocalStorageRepository.getToken();
    if (!token) {
      navigate("/login");
    } else {
      loadUserDetails(token);
    }
  }, []); 

  const loadUserDetails = (token) => {
    console.log("Requesting user details with token:", token);

    getUserDetails(token)
      .then((data) => {
        console.log("Fetched user data:", data);
        setUser(data);
        setUpdatedUser({
          email: data.email,
          password: data.password,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login");
      });
};

const handleSave = () => {
    const token = TokenLocalStorageRepository.getToken(); 
    if (!token || !user) {
      navigate("/login");
      return;
    }

    const userUpdateData = {
      email: updatedUser.email,
      password: updatedUser.password,
    };

    updateUserDetails(token, userUpdateData) 
    .then((data) => {
      console.log("User information updated:", data);
      // user.id가 null 또는 undefined인 경우를 방지하기 위해 확인
      if (user && user.id) {
        navigate(`/mypage/`);
      } else {
        console.error("User ID is missing");
      }
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
