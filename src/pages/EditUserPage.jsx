import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails, updateUserDetails } from "../api/apiService"; 
import { TokenLocalStorageRepository } from "../repository/localstorages";

import './EditUserPage.css';

const EditUserPage = () => {
  const { id } = useParams();
  console.log("User ID from URL:", id); 
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
      });
  };
  

  const handleSave = () => {
    const token = TokenLocalStorageRepository.getToken();
    if (!token) {
      navigate("/login"); 
      return;
    }

    updateUserDetails(token, updatedUser)
      .then((data) => {
        console.log("User information updated:", data);
        navigate(`/mypage/${id}`); 
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
    return <p>Loading...</p>; 
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

          <button type="button" onClick={handleSave}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
