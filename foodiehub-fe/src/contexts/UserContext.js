// src/contexts/UserContext.js
import React, { createContext, useState, useContext,useEffect } from "react";
import { useLocation } from "react-router-dom";
import {getAuthMe} from "../store/UserStore";

// Context 생성
const UserContext = createContext();

// Provider 컴포넌트 생성
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        nickname:"",
        role:"",
        profileimageurl:"/img/default-profile.png",}); // 사용자 상태
    const location = useLocation(); // 현재 URL 추적
    
    // 사용자 정보를 가져오는 함수
    const fetchUser = async () => {
        try {
            const userInfo = await getAuthMe("GET", "/api/auth/me");
            // 정상 응답(200 ok 일때)
            setUser({
                nickname: userInfo.nickname,
                role: userInfo.role || "ROLE_USER",
                profileimageurl : userInfo.profileimageurl || "/img/default-profile.png",
            });
            console.log("auth/me 가져옴",userInfo);
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
     
    // 초기 로딩 시 사용자 정보 가져오기
    useEffect(() => {
        fetchUser();
    }, [location.pathname]);  //  URL이 변경될 때마다 실행


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook으로 Context 사용
export const useUser = () => useContext(UserContext);
