import React, { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import { TokenLocalStorageRepository } from "../repository/localstorages";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingInquiry, setEditingInquiry] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchInquiries();
  }, []);

  const fetchUsers = async () => {
  try {
    const token = TokenLocalStorageRepository.getToken();
    const res = await fetch("/api/users", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    setUsers(data);
  } catch (err) {
    console.error("fetchUsers error:", err);
  }
};

const fetchInquiries = async () => {
  try {
    const token = TokenLocalStorageRepository.getToken();
    const res = await fetch("/api/inquiries", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    setInquiries(data);
  } catch (err) {
    console.error("fetchInquiries error:", err);
  }
};

  const handleDeleteUser = async (id) => {
    if (!window.confirm("정말 이 유저를 삭제하시겠습니까?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    setInquiries(inquiries.filter((i) => i.id !== id));
  };

  const handleEditUser = (user) => setEditingUser(user);
  const handleEditInquiry = (inq) => setEditingInquiry(inq);

  const handleSaveUser = async () => {
    const { id, name, email } = editingUser;
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setUsers(users.map(u => (u.id === id ? editingUser : u)));
    setEditingUser(null);
  };

  const handleSaveInquiry = async () => {
    const { id, subject, message } = editingInquiry;
    await fetch(`/api/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    setInquiries(inquiries.map(i => (i.id === id ? editingInquiry : i)));
    setEditingInquiry(null);
  };

  return (
    <div className={styles.container}>
      <section className={styles.listSection}>
        <h2>유저 목록</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>이름</th><th>이메일</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
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
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.listSection}>
        <h2>문의 목록</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>제목</th><th>메시지</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {inquiries.map(inq => (
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
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Admin;
