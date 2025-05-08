// src/pages/EditUserPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../api/apiService";  // 유저 정보를 가져오는 API

const EditUserPage = () => {
  const { id } = useParams();  // URL에서 user ID 가져오기
  const [user, setUser] = useState(null);

  useEffect(() => {
    // user 정보 불러오기
    getUserDetails(id)
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, [id]);

  const handleSave = () => {
    // 유저 정보를 수정 후 저장하는 로직 (예시)
    console.log("User information saved!");
  };

  return (
    <div>
      <h1>Edit User Info</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
          <p>Phone: {user.userphone}</p>
          <p>Password: {user.userpassword}</p>
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditUserPage;
