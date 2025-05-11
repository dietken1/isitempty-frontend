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

      const response = await getUserMe();
      const userData = response.data;
      if (userData?.roleType === 'ADMIN') {
        setLoading(prev => ({ ...prev, auth: false }));
        fetchUsers();
        fetchInquiries();
      } else {
        setError(prev => ({ ...prev, auth: "관리자 권한이 없습니다." }));
        setLoading(prev => ({ ...prev, auth: false }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, auth: "인증 확인 중 오류: " + err.message }));
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
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(prev => ({ ...prev, users: err.message }));
      setUsers([]);
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
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(prev => ({ ...prev, inquiries: err.message }));
      setInquiries([]);
    } finally {
      setLoading(prev => ({ ...prev, inquiries: false }));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("정말 이 유저를 삭제하시겠습니까?")) return;
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch("/api/v1/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error(res.statusText);
      setUsers(prev => prev.filter(u => u.userId !== id));
    } catch (err) {
      alert("유저 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/question/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(res.statusText);
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert("문의 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEditUser = user => setEditingUser(user);
  const handleEditInquiry = inq => setEditingInquiry(inq);

  const handleSaveUser = async () => {
    const { userId, username, email } = editingUser;
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch("/api/v1/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId, username, email })
      });
      if (!res.ok) throw new Error(res.statusText);
      setUsers(prev => prev.map(u => (u.userId === userId ? editingUser : u)));
      setEditingUser(null);
    } catch (err) {
      alert("유저 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleSaveInquiry = async () => {
    const { id, message } = editingInquiry;
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/question/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error(res.statusText);
      setInquiries(prev => prev.map(i => (i.id === id ? editingInquiry : i)));
      setEditingInquiry(null);
    } catch (err) {
      alert("문의 정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      {loading.auth ? (
        <div>관리자 권한 확인 중...</div>
      ) : error.auth ? (
        <div>
          <p>{error.auth}</p>
          <button onClick={() => navigate("/login")}>로그인</button>
        </div>
      ) : (
        <>
          <div className={styles.adminHeader}>
            <h1>관리자 페이지</h1>
            <button onClick={logout}>로그아웃</button>
          </div>

          <section className={styles.listSection}>
            <h2>유저 목록</h2>
            {loading.users ? (
              <div>불러오는 중…</div>
            ) : error.users ? (
              <div>Error: {error.users}</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th><th>이름</th><th>이메일</th><th>권한</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="5">유저가 없습니다.</td></tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{editingUser?.userId === user.userId ? (
                          <input value={editingUser.username} onChange={e => setEditingUser({ ...editingUser, username: e.target.value })} />
                        ) : user.username}</td>
                        <td>{editingUser?.userId === user.userId ? (
                          <input value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} />
                        ) : user.email}</td>
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
              <div>불러오는 중…</div>
            ) : error.inquiries ? (
              <div>Error: {error.inquiries}</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th><th>메시지</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <tr><td colSpan="3">문의가 없습니다.</td></tr>
                  ) : (
                    inquiries.map(inq => (
                      <tr key={inq.id}>
                        <td>{inq.id}</td>
                        <td>{editingInquiry?.id === inq.id ? (
                          <input value={editingInquiry.message} onChange={e => setEditingInquiry({ ...editingInquiry, message: e.target.value })} />
                        ) : inq.message}</td>
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