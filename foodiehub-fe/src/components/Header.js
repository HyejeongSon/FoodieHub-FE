// src/components/Header.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { httpRequest } from "../store/httpRequest";
import { useUser } from "../contexts/UserContext"; // Context 추가
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser(); // Context에서 상태 가져오기


    // **1. Context 상태 업데이트 확인**
    useEffect(() => {
        console.log("Header에서 Context 상태 업데이트 호출됨");
    }, []);

    // 네비게이션 함수
    const handleNavigate = (path) => {
        navigate(path);
    };

    // **2. API 호출 및 사용자 상태 업데이트**
    useEffect(() => {
        console.log("Header 컴포넌트 useEffect 실행됨");
        const fetchUserData = async () => {
            try {
                const userInfo = await httpRequest("GET", "/api/auth/me"); //header/user
                // setUser({email:data.email, role: data.role });
                setUser({
                    email: userInfo.email,
                    name: userInfo.name,
                    nickname: userInfo.nickname,
                    provider: userInfo.provider,
                    role: userInfo.role || "ROLE_USER",
                });

            } catch (error) {
                console.error("GET /api/auth/me 실패:", error);
            }
        };

        fetchUserData();
    }, [setUser]); // useEffect 종속성에 setUser 포함


    // **3. 사용자 상태 확인**
    useEffect(() => {
        console.log("Header에서 사용자 상태 확인:", user);
    }, [user]); // user 상태 변화 감지


    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            const response = await httpRequest("POST", "/api/auth/logout");

            // 로컬 스토리지 및 상태 초기화
            localStorage.removeItem("access_token");
            deleteCookie("oauth2_auth_request");
            // setUser({ username: "", role: "" }); // 사용자 상태 초기화
            setUser({
                email: "",
                name: "",
                nickname: "",
                provider: "",
                role: ""
            });
            navigate("/main");
        } catch (error) {
            alert("로그아웃에 실패했습니다.");
        }
    };
    const deleteCookie = (name) => {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    };

    return (
        <header>
            <div className="checkered-bar"></div>
            <div className="logo-wrapper">
                <img
                    src="/img/foodieHub.png"
                    alt="foodieHub" width={277} height={195} style={{ margin: '20px auto 0' }}
                    className="logo"
                    onClick={() => handleNavigate("/main")}
                /></div>
            <nav className="nav">
                {<button className="header-button" onClick={() => navigate("/")}>홈</button>}

                {user.email && user.role.split("_").pop() === "USER" &&
                    <button className="header-button" onClick={() => navigate("/mypage")}>마이페이지</button>
                }

                {user.email && user.role === "ROLE_ADMIN" &&
                    <button className="header-button" onClick={() => navigate("/mypage")}>관리자마이페이지</button>}
                    

                {user.email &&
                    <button className="header-button" id="logout-btn" onClick={handleLogout}>로그아웃</button>}


                {!user.email &&
                    <button className="header-button" onClick={() => navigate("/login")}>로그인</button>}
            </nav>
        </header>
    );
};

export default Header;
