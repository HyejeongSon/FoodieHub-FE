// src/contexts/UserContext.js
import React, { createContext, useState, useContext,useEffect } from "react";
import { useLocation } from "react-router-dom";
import {httpRequest} from "../store/httpRequest";

// Context 생성
const UserContext = createContext();

// Provider 컴포넌트 생성
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        userid: "",
        cellphone:"",
        email:"",
        name:"",
        nickname:"",
        provider:"",
        role:"",
        businessno:"",
        profileimageurl:"/img/default-profile.png",}); // 사용자 상태
    const location = useLocation(); // 현재 URL 추적
    // 사용자 정보를 가져오는 함수
    const fetchUser = async () => {
        try {
            const userInfo = await httpRequest("GET", "/api/auth/me");
            setUser(userInfo); // 최신 사용자 정보로 상태 업데이트
            console.log("UserCotext에서 auth/me 가져옴",userInfo);
        } catch (error) {
            console.error("유저 정보 가져오기 실패:", error);
        }
    };
     
    // 초기 로딩 시 사용자 정보 가져오기
    useEffect(() => {
        fetchUser();
    }, [location.pathname]);  // URL이 변경될 때마다 실행


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook으로 Context 사용
export const useUser = () => useContext(UserContext);
