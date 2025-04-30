import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // `history` -> `navigate`

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invalidCreds, setInvalidCreds] = useState(false);
    const navigate = useNavigate(); // `history` -> `navigate`로 수정
    
    // 로그인 처리 함수
    const handleLogin = (e) => {
        e.preventDefault();

        // 서버로 로그인 데이터 보내기 (예시: axios)
        axios.post('/api/login/', { email, password })
            .then((response) => {
                // 로그인 성공 시 홈 페이지로 이동
                console.log('Login Success:', response);  // 응답 로그
                navigate('/');  // history.push('/') -> navigate('/')
            })
            .catch((error) => {
                setInvalidCreds(true);
                console.error("Login failed:", error);  // 에러 확인
            });
    };

    return (
        <div className="login-container">
            <div className="login_container">
                <form onSubmit={handleLogin}>
                    <h1 className="form-title">로그인</h1>
                    <div className="login_elements">
                        <div className="input-group">
                            <label htmlFor="email" className="input-label">이메일</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일"
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password" className="input-label">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호"
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="login_btn">
                        <button type="submit" className="login-btn">로그인</button>
                    </div>
                    <div className="login-add">
                        <p className="login-link">
                            아직 계정이 없으신가요? <a href="/signup">회원가입</a>
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
                    {invalidCreds && <p className="invalid-credentials">다시 시도해주세요</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
