import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [invalidCreds, setInvalidCreds] = useState(false);
    const navigate = useNavigate();

    // 회원가입 처리 함수
    const handleSignup = (e) => {
        e.preventDefault();

        // 비밀번호 확인
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 서버로 회원가입 데이터 보내기 (예시: axios)
        axios.post('/api/signup/', { email, username, phone, password })
            .then((response) => {
                console.log('Signup Success:', response);  // 응답 로그
                navigate('/login');  // 회원가입 성공 후 로그인 페이지로 이동
            })
            .catch((error) => {
                setInvalidCreds(true);
                console.error("Signup failed:", error);  // 에러 확인
            });
    };

    return (
        <div className="signup-container">
            <div className="signup_container">
                <form onSubmit={handleSignup}>
                    
                    <div className="signup_elements">
                        <h1>회원가입</h1>
                        <div>
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone">전화번호</label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="전화번호"
                            />
                        </div>
                        <div>
                            <label htmlFor="username">아이디</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="아이디"
                            />
                        </div>
                        <div>
                            <label htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="비밀번호 확인"
                            />
                        </div>
                    </div>
                    <div className="signup-button"><button type="submit" className="signup-btn">회원가입</button></div>
                    <div className="signup-add">
                        <p className="signup-link">
                            이미 계정이 있으신가요? <a href="/login">로그인</a>
                        </p>
                    </div>
                    <hr />
                    <div className="social-login">
                        <p>소셜 로그인</p>
                        <button type="button" className="naver" onClick={() => window.location.href = '/auth/naver'}>
                            <img src="/images/naver.png" alt="Naver Login" />
                        </button>
                        <button type="button" className="google" onClick={() => window.location.href = '/auth/google'}>
                            <img src="/images/google.png" alt="Google Login" />
                        </button>
                        <button type="button" className="kakao" onClick={() => window.location.href = '/auth/kakao'}>
                            <img src="/images/kakao.png" alt="Kakao Login" />
                        </button>
                    </div>
                    {invalidCreds && <p>다시 시도해주세요</p>}
                </form>
            </div>
        </div>
    );
};

export default Signup;
