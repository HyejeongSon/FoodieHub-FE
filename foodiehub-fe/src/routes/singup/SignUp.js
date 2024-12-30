import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpRequest } from "../../store/httpRequest"; // httpRequest를 불러옴
import logo from "../../image/logo-1.png";
import "../../styles/SignUp.css";

function SignUp() {
    const [formData, setFormData] = useState({
        email: "",
        password1: "",
        password2: "",
        nickname: "",
        name: "",
        cellphone: "",
        role: "ROLE_USER",
    });

    const [errors, setErrors] = useState([]);
    const [nicknameCheckResult, setNicknameCheckResult] = useState("");
    const navigate = useNavigate();

    // 입력 값 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 닉네임 중복 확인
    const checkNickname = async () => {
        try {
            const response = await httpRequest(
                "GET",
                `/api/user/check-nickname?nickname=${formData.nickname}`
            );

            setNicknameCheckResult(response.message || "사용 가능한 닉네임입니다.");
        } catch (error) {
            setNicknameCheckResult(error.message || "닉네임 중복 확인 중 오류가 발생했습니다.");
        }
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);  // 기존 에러 초기화

        try {
            const response = await httpRequest("POST", "/api/auth/user", formData);
            alert("회원가입이 완료되었습니다.");
            navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
        } catch (error) {
            console.error("회원가입 실패:", error);

            // 서버 응답에서 에러 메시지 추출
            if (error.response && error.response.errors) {
                const validationErrors = error.response.errors; // errors 배열
                alert(validationErrors.join("\n")); // 줄바꿈으로 메시지 표시
            } else {
                alert("회원가입 중 알 수 없는 오류가 발생했습니다.");
            }

        }
    };

    return (
        <div className="user-container">
            <div className="user-container">
            <img src={logo} alt="푸디허브 로고" className="logoImage" />
            <div className="signup-form">
            <p class="userTitle">회원가입</p>
            <hr className="divider" />

            {/* 폼 에러 표시 */}
            {errors.length > 0 && (
                <div>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index} style={{ color: "red" }}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
            <div className="signup-title">
                {/* 이메일 입력 */}
                <div className='form-group'>
                    <label htmlFor="email">아이디(Email)</label>
                    <input
                        className="Input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 비밀번호 입력 */}
                <div className='form-group'>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        name="password1"
                        value={formData.password1}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 비밀번호 확인 */}
                <div className='form-group'>
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 닉네임 */}
                <div className='form-group'>
                    <label>닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                    {/*<button type="button" onClick={checkNickname}>*/}
                    {/*    중복 확인*/}
                    {/*</button>*/}
                    {/*{nicknameCheckResult && (*/}
                    {/*    <div style={{ marginTop: "10px", color: "red" }}>{nicknameCheckResult}</div>*/}
                    {/*)}*/}
                </div>

                {/* 실명 */}
                <div className='form-group'>
                    <label>실명</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 전화번호 */}
                <div className='form-group'>
                    <label>전화번호</label>
                    <input
                        type="text"
                        name="cellphone"
                        value={formData.cellphone}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* hidden input으로 role 전달 */}
                <input type="hidden" name="role" value={formData.role} />
                </div>
                <div className="button-group">
                    <button className="prebtn" onClick={() => window.history.back()}>
                        이전으로
                    </button>
                    <button className="signupbtn" type="submit">
                        회원가입
                    </button>
                </div>
            </form>  
                </div>
            </div>
        </div>
    );
}

export default SignUp;