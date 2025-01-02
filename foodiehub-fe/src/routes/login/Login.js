import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpRequest } from "../../store/httpRequest"; // httpRequest를 불러옴
import { useUser } from "../../contexts/UserContext"; // Context 추가
import logo from "../../image/logo-1.png";
import "../../styles/Login.css";

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
            const response = await httpRequest("POST", "/api/auth/login", {
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

                // 추가로 사용자 정보 가져오기
                const userInfo = await httpRequest("GET", "/api/auth/me", null, {
                    headers: {
                        Authorization: `Bearer ${response.token || localStorage.getItem("access_token")}`,
                    },
                });
                console.log("사용자 정보:", userInfo);

                // 사용자 상태 업데이트
                // setUser({
                //     userid: userInfo.userid,
                //     cellphone: userInfo.cellphone,
                //     email: userInfo.email,
                //     name : userInfo.name,
                //     nickname : userInfo.nickname,
                //     provider : userInfo.provider,
                //     role: userInfo.role || "ROLE_USER",
                // });
                setUser(userInfo); // 최신 사용자 정보로 상태 업데이트



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
            <div>
                {/* OAuth 로그인 버튼 */}
                <hr className="divider" />
                <p className="sns-login-text">SNS 로그인</p>
                <a href="/oauth2/authorization/google">
                    <img className="sns-btn" src="/img/google.png" width="50" height="50" alt="Google 로그인" />
                </a>
                <a href="/oauth2/authorization/kakao">
                    <img className="sns-btn" src="/img/kakao.png" width="50" height="50" alt="Kakao 로그인" />
                </a>
                <a href="/oauth2/authorization/naver">
                    <img className="sns-btn" src="/img/naver.png" width="50" height="50" alt="Naver 로그인" />
                </a>
            </div>
            </div>
            <div>
                <div className="register-row">
                    <p className="register-question">계정이 없으신가요?&ensp;</p>
                    <p className="register-text" onClick={() => navigate("/signup")}>
                        회원가입
                    </p>
                </div>
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
