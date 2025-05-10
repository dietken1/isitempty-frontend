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
      const message = await updateUserDetails(token, userUpdateData);
      console.log("User information updated:", message);
      navigate("/mypage/");
    } catch (error) {
      console.error("Error updating user information:", error);
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
