import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext"; // Context 추가
import logo from "../../image/logo-1.png";
import "../../styles/Login.css";
import { postLogin } from "../../store/UserStore";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUser } = useUser(); // Context에서 setUser 가져오기


    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        // 디버깅 로그
        console.log("로그인 요청 데이터:", { email, password });

        // 입력값 검증
        if (!email.trim()) {
            setError("이메일을 입력해주세요.");
            return;
        }
        if (!password.trim()) {
            setError("비밀번호를 입력해주세요.");
            return;
        }

        try {
            // 로그인 요청
            const response = await postLogin("POST", "/api/auth/login", {
                username: email, // email 필드
                password: password // password 필드
            });
            console.log("서버 응답 확인:", response);

            // response는 이미 JSON 데이터
            if (response.message === "Authentication successful") {
                console.log("로그인 성공:", response.message);

                // 토큰 저장
                if (response.token) {
                    localStorage.setItem("access_token", response.token);
                }
                navigate("/main"); // React Router를 이용해 메인 페이지로 이동
            } else {
                console.error("로그인 실패:", response.message);
                setError(response.message || "로그인 실패");
            }

        } catch (err) {
            console.error("로그인 실패:", err);
            setError("로그인 실패. 이메일과 비밀번호를 확인해주세요.");
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="푸디허브 로고" className="logoImage" onClick={() => navigate("/")}/>
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="email"
                        className="idInput"
                        placeholder="이메일주소 입력"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        required
                    />
                </div>
                <div>
                <div>
                    <input
                        type="password"
                        className="pwInput"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        required
                    />
                </div>
                </div>
                <button type="submit" className="loginbtn">로그인</button>
            </form>

            <div>
                <div className="register-row">
                    <p className="register-question">사장님이세요?</p>
                    <p className="register-text" onClick={() => navigate("/signup_admin")}>
                        사업자회원가입
                    </p>
                </div>
            </div>
        </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;
