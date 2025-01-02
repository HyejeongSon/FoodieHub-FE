// src/components/Header.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // Context 추가
import "./Header.css";
import { getAuthMe,postLogout } from "../store/UserStore";


const Header = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser(); // Context에서 상태 가져오기


    // // **1. Context 상태 업데이트 확인**
    // useEffect(() => {
    //     console.log("Header에서 Context 상태 업데이트 호출됨");
    // }, []);

    // 네비게이션 함수
    const handleNavigate = (path) => {
        navigate(path);
    };

    // **2. API 호출 및 사용자 상태 업데이트**
    useEffect(() => {
        console.log("Header 컴포넌트 useEffect 실행됨");
        const fetchUserData = async () => {
            try {
                const userInfo = await getAuthMe("GET", "/api/auth/me"); //header/user
                setUser({
                    nickname: userInfo.nickname,
                    role: userInfo.role || "ROLE_USER",
                    profileimageurl : userInfo.profileimageurl || "/img/default-profile.png",
                });

            } catch (error) {
                if (error.status === 401) {
                    // “로그인 필요” 상황이므로 에러로 보지 말고 원하는 처리를 해주기
                    console.log('401! 로그인 필요');
                    // 예) window.location.href = "/login";
                  } else {
                    // 나머지 진짜 오류
                    console.error("auth/me 가져오기 실패:", error);
                  }
            }
        };

        fetchUserData();
    }, []); // "API" 한번만 호출하고 싶다,컴포넌트 최초 마운트시에만 한번 실행됩니다.


    // **3. 사용자 상태 확인**
    useEffect(() => {
        console.log("Header에서 사용자 상태 확인:", user);
    }, [user]); // user 상태 변화 감지


    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            const response = await postLogout("POST", "/api/auth/logout");

            // 로컬 스토리지 및 상태 초기화
            localStorage.removeItem("access_token");
            deleteCookie("oauth2_auth_request");
            setUser({
                nickname: "",
                role: "",
                profileimageurl: "",
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

            {/* user.role.split("_").pop() === "USER" && */}
                {user.nickname && 
                    <button className="header-button" onClick={() => navigate("/mypage")}>마이페이지</button>
                }
         
                {user.nickname && user.role === "ROLE_ADMIN" &&
                    <button className="header-button" onClick={() => navigate("/mystore")}>내 식당</button>}
                    
                {user.nickname &&
                    <button className="header-button" id="logout-btn" onClick={handleLogout}>로그아웃</button>}


                {!user.nickname &&
                    <button className="header-button" onClick={() => navigate("/login")}>로그인</button>}
            </nav>
        </header>
    );
};

export default Header;
