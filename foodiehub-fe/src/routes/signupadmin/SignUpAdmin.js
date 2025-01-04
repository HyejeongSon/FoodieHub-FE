import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../image/logo-1.png";
import "../../styles/SignupAdmin.css";

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: "",
        password1: "",
        password2: "",
        nickname: "",
        name: "",
        cellphone: "",
        businessno: "",
    });

    const [apiResult, setApiResult] = useState(null);
    const [isBusinessValid, setIsBusinessValid] = useState(false);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const checkBusinessStatus = async () => {
        const { businessno } = formData;

        if (!businessno.trim()) {
            alert("사업자등록번호를 입력해주세요.");
            return;
        }

        const requestData = { b_no: [businessno] };

        try {
            const response = await axios.post(
                "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=DG9BCYOkv0KecbO5GENaPuos0JumR8%2BrxO56bwM2jagOzJBJi8EfOoy32MGe0tnZm4JoGNIzGmBkPafHaohiBw%3D%3D",
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (
                response.data.match_cnt === 1 &&
                response.data.data[0].b_stt === "계속사업자"
            ) {
                setApiResult("API 조회 성공: 계속사업자");
                setIsBusinessValid(true);
            } else {
                setApiResult("계속사업자가 아닙니다.");
                setIsBusinessValid(false);
                alert("계속사업자만 회원가입이 가능합니다.");
            }
        } catch (error) {
            setApiResult(`API 호출 실패: ${error.response?.data || error.message}`);
            setIsBusinessValid(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            const response = await axios.post("/api/auth/admin", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            alert("회원가입이 완료되었습니다.");
            navigate("/login_admin");
        } catch (error) {
            console.error("회원가입 실패:", error);

            if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                alert(validationErrors.join("\n"));
            } else {
                alert("회원가입 중 알 수 없는 오류가 발생했습니다.");
            }
        }
    };
    
    return (
    <div className="admin-container">
        <img src={logo} alt="푸디허브 로고" className="logoImage" />
        <div className="adminsignup-title">
            <p class="adminTitle">사장님 회원가입</p>
            <hr className="divider" />
            <form className="adminsignup-form" onSubmit={handleSubmit}>
                {apiResult && <div>{apiResult}</div>}

                {errors.length > 0 && (
                    <div>
                        {errors.map((error, index) => (
                            <p key={index} style={{ color: "red" }}>
                                {error}
                            </p>
                        ))}
                    </div>
                )}

                <div className='form-group'>
                    <label htmlFor="email">아이디(Email)</label>
                    <input
                        className="adminInput"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="이메일을 입력하세요"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        name="password1"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        type="password"
                        name="password2"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="비밀번호를 다시 입력하세요"
                    />
                </div>

                <div className="form-group">
                    <label>닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>실명</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>전화번호</label>
                    <input
                        type="text"
                        name="cellphone"
                        value={formData.cellphone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="input-button-group">
                    <label>사업자 등록번호</label>
                    <input
                        type="text"
                        name="businessno"
                        value={formData.businessno}
                        onChange={handleInputChange}
                    />
                    <button type="button" onClick={checkBusinessStatus}>
                        조회
                    </button>
                </div>
                 {/* 회원가입 버튼 */}
                <div className="button-group">
                    <button className="prebtn" onClick={() => window.history.back()}>
                        이전으로
                    </button>
                    <button className="signupbtn" type="submit" disabled={!isBusinessValid}>
                        회원가입
                    </button>
                </div>
            </form>
        </div>
    </div>
    );
};

export default SignUp;