import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import { TokenLocalStorageRepository } from "../repository/localstorages";
import { getUserMe } from "../api/apiService";

const PAGE_SIZE = 10;

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [loading, setLoading] = useState({
    users: false,
    inquiries: false,
    auth: true,
  });
  const [error, setError] = useState({
    users: null,
    inquiries: null,
    auth: null,
  });
  const navigate = useNavigate();

  const [userPage, setUserPage] = useState(1);
  const [inqPage, setInqPage] = useState(1);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = TokenLocalStorageRepository.getToken();
      if (!token) {
        setError((prev) => ({
          ...prev,
          auth: "인증 토큰이 없습니다. 로그인이 필요합니다.",
        }));
        setLoading((prev) => ({ ...prev, auth: false }));
        return;
      }

      const response = await getUserMe();
      const userData = response.data;

      if (userData && userData.roleType === "ADMIN") {
        setLoading((prev) => ({ ...prev, auth: false }));
        fetchUsers();
        fetchInquiries();
      } else {
        setError((prev) => ({ ...prev, auth: "관리자 권한이 없습니다." }));
        setLoading((prev) => ({ ...prev, auth: false }));
      }
    } catch (err) {
      console.error("관리자 인증 확인 오류:", err);
      setError((prev) => ({
        ...prev,
        auth: "인증 확인 중 오류가 발생했습니다: " + err.message,
      }));
      setLoading((prev) => ({ ...prev, auth: false }));
    }
  };

  const logout = () => {
    TokenLocalStorageRepository.removeToken();
    navigate("/login");
  };

  const fetchUsers = async () => {
    setLoading((l) => ({ ...l, users: true }));
    setError((e) => ({ ...e, users: null }));
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setUsers(data);
      setUserPage(1);
    } catch (err) {
      setError((e) => ({ ...e, users: err.message }));
    } finally {
      setLoading((l) => ({ ...l, users: false }));
    }
  };

  const fetchInquiries = async () => {
    setLoading((l) => ({ ...l, inquiries: true }));
    setError((e) => ({ ...e, inquiries: null }));
    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch("/api/question", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setInquiries(data);
      setInqPage(1);
    } catch (err) {
      setError((e) => ({ ...e, inquiries: err.message }));
    } finally {
      setLoading((l) => ({ ...l, inquiries: false }));
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.roleType === "ADMIN" ? "USER" : "ADMIN";
    if (
      !window.confirm(
        `${user.username}의 권한을 ${newRole}로 변경하시겠습니까?`
      )
    )
      return;
    try {
      const token = TokenLocalStorageRepository.getToken();

      const res = await fetch(`/api/admin/users/${user.userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roleType: newRole }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("권한 변경 실패 응답:", res.status, errorText);
        throw new Error(`${res.status}: ${errorText || res.statusText}`);
      }

      setUsers((us) =>
        us.map((u) =>
          u.userId === user.userId ? { ...u, roleType: newRole } : u
        )
      );
      alert("권한이 변경되었습니다.");
    } catch (err) {
      console.error("권한 변경 오류:", err);
      alert(`권한 변경에 실패했습니다: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("정말 이 유저를 삭제하시겠습니까?")) return;

    try {
      const token = TokenLocalStorageRepository.getToken();

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`삭제 실패: ${res.status}`);
      }

      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err) {
      console.error(err);
      alert("유저 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;

    try {
      const token = TokenLocalStorageRepository.getToken();
      const res = await fetch(`/api/question/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleSaveUser = async () => {
    const { userId, username, email, password, roleType } = editingUser;
    if (!window.confirm("이 내용으로 수정하시겠습니까?")) return;

    try {
      const token = TokenLocalStorageRepository.getToken();

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password, roleType }),
      });

      if (!res.ok) {
        throw new Error(`수정 실패: ${res.status}`);
      }

      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? editingUser : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error(err);
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error(`수정 실패: ${res.status} ${res.statusText}`);
      }

      setInquiries(inquiries.map((i) => (i.id === id ? editingInquiry : i)));
      setEditingInquiry(null);
    } catch (err) {
      console.error("문의 수정 오류:", err);
      alert("문의 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const pagedUsers = users.slice(
    (userPage - 1) * PAGE_SIZE,
    userPage * PAGE_SIZE
  );
  const pagedInquiries = inquiries.slice(
    (inqPage - 1) * PAGE_SIZE,
    inqPage * PAGE_SIZE
  );
  const totalUserPages = Math.ceil(users.length / PAGE_SIZE);
  const totalInqPages = Math.ceil(inquiries.length / PAGE_SIZE);

  return (
    <div className={styles.container}>
      {loading.auth ? (
        <div>관리자 권한 확인 중...</div>
      ) : error.auth ? (
        <div className={styles.error}>{error.auth}</div>
      ) : (
        <>
          <div className={styles.adminHeader}>
            <h1>관리자 페이지</h1>
            <button onClick={logout}>로그아웃</button>
          </div>

          <section className={styles.listSection}>
            <h2>유저 목록</h2>
            {loading.users ? (
              <div>로딩 중...</div>
            ) : error.users ? (
              <div className={styles.error}>{error.users}</div>
            ) : (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>이름</th>
                      <th>이메일</th>
                      <th>권한</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedUsers.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>
                          {editingUser?.userId === user.userId ? (
                            <input
                              value={editingUser.username}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  username: e.target.value,
                                })
                              }
                            />
                          ) : (
                            user.username
                          )}
                        </td>
                        <td>
                          {editingUser?.userId === user.userId ? (
                            <input
                              value={editingUser.email}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  email: e.target.value,
                                })
                              }
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td>{user.roleType}</td>
                        <td>
                          <button onClick={() => handleToggleRole(user)}>
                            권한 변경
                          </button>
                          {editingUser?.userId === user.userId ? (
                            <>
                              <button onClick={handleSaveUser}>저장</button>
                              <button onClick={() => setEditingUser(null)}>
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setEditingUser(user)}>
                                수정
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.userId)}
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => p - 1)}
                  >
                    Prev
                  </button>
                  <span>
                    {userPage} / {totalUserPages}
                  </span>
                  <button
                    disabled={userPage >= totalUserPages}
                    onClick={() => setUserPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>

          <section className={styles.listSection}>
            <h2>문의 목록</h2>
            {loading.inquiries ? (
              <div>로딩 중...</div>
            ) : error.inquiries ? (
              <div className={styles.error}>{error.inquiries}</div>
            ) : (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>이름</th>
                      <th>이메일</th>
                      <th>메시지</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedInquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td>{inq.id}</td>
                        <td>
                          {editingInquiry?.id === inq.id ? (
                            <input
                              value={editingInquiry.name}
                              onChange={(e) =>
                                setEditingInquiry({
                                  ...editingInquiry,
                                  name: e.target.value,
                                })
                              }
                            />
                          ) : (
                            inq.name
                          )}
                        </td>
                        <td>
                          {editingInquiry?.id === inq.id ? (
                            <input
                              value={editingInquiry.email}
                              onChange={(e) =>
                                setEditingInquiry({
                                  ...editingInquiry,
                                  email: e.target.value,
                                })
                              }
                            />
                          ) : (
                            inq.email
                          )}
                        </td>
                        <td>
                          {editingInquiry?.id === inq.id ? (
                            <input
                              value={editingInquiry.message}
                              onChange={(e) =>
                                setEditingInquiry({
                                  ...editingInquiry,
                                  message: e.target.value,
                                })
                              }
                            />
                          ) : (
                            inq.message
                          )}
                        </td>
                        <td>
                          {editingInquiry?.id === inq.id ? (
                            <>
                              <button onClick={handleSaveInquiry}>저장</button>
                              <button onClick={() => setEditingInquiry(null)}>
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setEditingInquiry(inq)}>
                                수정
                              </button>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <button
                    disabled={inqPage <= 1}
                    onClick={() => setInqPage((p) => p - 1)}
                  >
                    Prev
                  </button>
                  <span>
                    {inqPage} / {totalInqPages}
                  </span>
                  <button
                    disabled={inqPage >= totalInqPages}
                    onClick={() => setInqPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Admin;
