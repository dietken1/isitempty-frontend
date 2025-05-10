import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import { TokenLocalStorageRepository } from "../repository/localstorages";
import { getUserMe } from "../api/apiService";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [loading, setLoading] = useState({ users: false, inquiries: false, auth: true });
  const [error, setError] = useState({ users: null, inquiries: null, auth: null });
  const navigate = useNavigate();

  useEffect(() => {
    // 관리자 권한 확인
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = TokenLocalStorageRepository.getToken();
      if (!token) {
        setError(prev => ({ ...prev, auth: "인증 토큰이 없습니다. 로그인이 필요합니다." }));
        setLoading(prev => ({ ...prev, auth: false }));
        return;
      }

      // 사용자 정보 가져오기
      const response = await getUserMe();
      const userData = response.data;
      console.log("현재 사용자 정보:", response);

      // 관리자 권한 확인 (roleType이 'ADMIN'인지 확인)
      if (userData && userData.roleType === 'ADMIN') {
        setLoading(prev => ({ ...prev, auth: false }));
        // 권한이 확인되면 데이터 로드
        fetchUsers();
        fetchInquiries();
      } else {
        setError(prev => ({ ...prev, auth: "관리자 권한이 없습니다." }));
        setLoading(prev => ({ ...prev, auth: false }));
      }
    } catch (err) {
      console.error("관리자 인증 확인 오류:", err);
      setError(prev => ({ ...prev, auth: "인증 확인 중 오류가 발생했습니다: " + err.message }));
      setLoading(prev => ({ ...prev, auth: false }));
    }
  };

  const logout = () => {
    TokenLocalStorageRepository.removeToken();
    navigate("/login");
  };

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    setError(prev => ({ ...prev, users: null }));
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch("/api/v1/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      // 응답이 비어있는지 확인
      const text = await res.text();
      if (!text) {
        console.log("응답이 비어있습니다.");
        setUsers([]);
        return;
      }
      
      try {
        const data = JSON.parse(text);
        console.log("받은 사용자 데이터:", data);
        setUsers(Array.isArray(data) ? data : []);
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError);
        console.error("원본 텍스트:", text);
        setUsers([]);
        setError(prev => ({ ...prev, users: "데이터 형식 오류: " + parseError.message }));
      }
    } catch (err) {
      console.error("fetchUsers error:", err);
      setUsers([]);
      setError(prev => ({ ...prev, users: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchInquiries = async () => {
    setLoading(prev => ({ ...prev, inquiries: true }));
    setError(prev => ({ ...prev, inquiries: null }));
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch("/api/question", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      // 응답이 비어있는지 확인
      const text = await res.text();
      if (!text) {
        console.log("응답이 비어있습니다.");
        setInquiries([]);
        return;
      }
      
      try {
        const data = JSON.parse(text);
        console.log("받은 문의 데이터:", data);
        setInquiries(Array.isArray(data) ? data : []);
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError);
        console.error("원본 텍스트:", text);
        setInquiries([]);
        setError(prev => ({ ...prev, inquiries: "데이터 형식 오류: " + parseError.message }));
      }
    } catch (err) {
      console.error("fetchInquiries error:", err);
      setInquiries([]);
      setError(prev => ({ ...prev, inquiries: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, inquiries: false }));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("정말 이 유저를 삭제하시겠습니까?")) return;
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/v1/users/${id}`, {  // 경로 수정
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`삭제 실패: ${res.status} ${res.statusText}`);
      }
      
      setUsers(users.filter((u) => u.userId !== id));
    } catch (err) {
      console.error("유저 삭제 오류:", err);
      alert("유저 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/question/${id}`, {  // 경로 수정
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`삭제 실패: ${res.status} ${res.statusText}`);
      }
      
      setInquiries(inquiries.filter((i) => i.id !== id));
    } catch (err) {
      console.error("문의 삭제 오류:", err);
      alert("문의 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEditUser = (user) => setEditingUser(user);
  const handleEditInquiry = (inq) => setEditingInquiry(inq);

  const handleSaveUser = async () => {
    const { userId, username, email } = editingUser;
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/v1/users/${userId}`, {  // 경로 수정
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username, email }),
      });
      
      if (!res.ok) {
        throw new Error(`수정 실패: ${res.status} ${res.statusText}`);
      }
      
      setUsers(users.map(u => (u.userId === userId ? editingUser : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("유저 수정 오류:", err);
      alert("유저 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleSaveInquiry = async () => {
    const { id, name, email, message } = editingInquiry;
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/question/${id}`, {  // 경로 수정
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, message }),
      });
      
      if (!res.ok) {
        throw new Error(`수정 실패: ${res.status} ${res.statusText}`);
      }
      
      setInquiries(inquiries.map(i => (i.id === id ? editingInquiry : i)));
      setEditingInquiry(null);
    } catch (err) {
      console.error("문의 수정 오류:", err);
      alert("문의 정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      {loading.auth ? (
        <div className={styles.loading}>관리자 권한 확인 중...</div>
      ) : error.auth ? (
        <div className={styles.error}>
          <p>접근 오류: {error.auth}</p>
          <div className={styles.btnGroup}>
            <button onClick={() => navigate("/login")}>로그인하기</button>
            <button onClick={() => navigate("/")}>홈으로 이동</button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.adminHeader}>
            <h1>관리자 페이지</h1>
            <button onClick={logout} className={styles.logoutBtn}>로그아웃</button>
          </div>
          
          <section className={styles.listSection}>
            <h2>유저 목록</h2>
            {loading.users ? (
              <div className={styles.loading}>데이터를 불러오는 중...</div>
            ) : error.users ? (
              <div className={styles.error}>
                <p>오류: {error.users}</p>
                <button onClick={fetchUsers}>다시 시도</button>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr><th>ID</th><th>이름</th><th>이메일</th><th>권한</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.noData}>표시할 유저 데이터가 없습니다.</td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>
                          {editingUser?.userId === user.userId ? (
                            <input
                              value={editingUser.username}
                              onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                            />
                          ) : (
                            user.username
                          )}
                        </td>
                        <td>
                          {editingUser?.userId === user.userId ? (
                            <input
                              value={editingUser.email}
                              onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td>{user.roleType}</td>
                        <td>
                          {editingUser?.userId === user.userId ? (
                            <>
                              <button onClick={handleSaveUser}>저장</button>
                              <button onClick={() => setEditingUser(null)}>취소</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditUser(user)}>수정</button>
                              <button onClick={() => handleDeleteUser(user.userId)}>삭제</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </section>

          <section className={styles.listSection}>
            <h2>문의 목록</h2>
            {loading.inquiries ? (
              <div className={styles.loading}>데이터를 불러오는 중...</div>
            ) : error.inquiries ? (
              <div className={styles.error}>
                <p>오류: {error.inquiries}</p>
                <button onClick={fetchInquiries}>다시 시도</button>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr><th>ID</th><th>이름</th><th>이메일</th><th>메시지</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.noData}>표시할 문의 데이터가 없습니다.</td>
                    </tr>
                  ) : (
                    inquiries.map(inq => (
                      <tr key={inq.id}>
                        <td>{inq.id}</td>
                        <td>{inq.name}</td>
                        <td>{inq.email}</td>
                        <td>
                          {editingInquiry?.id === inq.id ? (
                            <input
                              value={editingInquiry.message}
                              onChange={e => setEditingInquiry({ ...editingInquiry, message: e.target.value })}
                            />
                          ) : (
                            inq.message
                          )}
                        </td>
                        <td>
                          {editingInquiry?.id === inq.id ? (
                            <>
                              <button onClick={handleSaveInquiry}>저장</button>
                              <button onClick={() => setEditingInquiry(null)}>취소</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditInquiry(inq)}>수정</button>
                              <button onClick={() => handleDeleteInquiry(inq.id)}>삭제</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Admin;
