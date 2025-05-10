import React, { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import { TokenLocalStorageRepository } from "../repository/localstorages";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [loading, setLoading] = useState({ users: false, inquiries: false });
  const [error, setError] = useState({ users: null, inquiries: null });

  useEffect(() => {
    fetchUsers();
    fetchInquiries();
  }, []);

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    setError(prev => ({ ...prev, users: null }));
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch("/api/users", {
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
      const res = await fetch("/api/inquiries", {
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
      const res = await fetch(`/api/users/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`삭제 실패: ${res.status} ${res.statusText}`);
      }
      
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("유저 삭제 오류:", err);
      alert("유저 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/inquiries/${id}`, { 
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
    const { id, name, email } = editingUser;
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, email }),
      });
      
      if (!res.ok) {
        throw new Error(`수정 실패: ${res.status} ${res.statusText}`);
      }
      
      setUsers(users.map(u => (u.id === id ? editingUser : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("유저 수정 오류:", err);
      alert("유저 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleSaveInquiry = async () => {
    const { id, subject, message } = editingInquiry;
    
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ subject, message }),
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
              <tr><th>ID</th><th>이름</th><th>이메일</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.noData}>표시할 유저 데이터가 없습니다.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {editingUser?.id === user.id ? (
                        <input
                          value={editingUser.name}
                          onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingUser?.id === user.id ? (
                        <input
                          value={editingUser.email}
                          onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUser?.id === user.id ? (
                        <>
                          <button onClick={handleSaveUser}>저장</button>
                          <button onClick={() => setEditingUser(null)}>취소</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditUser(user)}>수정</button>
                          <button onClick={() => handleDeleteUser(user.id)}>삭제</button>
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
              <tr><th>ID</th><th>제목</th><th>메시지</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.noData}>표시할 문의 데이터가 없습니다.</td>
                </tr>
              ) : (
                inquiries.map(inq => (
                  <tr key={inq.id}>
                    <td>{inq.id}</td>
                    <td>
                      {editingInquiry?.id === inq.id ? (
                        <input
                          value={editingInquiry.subject}
                          onChange={e => setEditingInquiry({ ...editingInquiry, subject: e.target.value })}
                        />
                      ) : (
                        inq.subject
                      )}
                    </td>
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
    </div>
  );
};

export default Admin;
