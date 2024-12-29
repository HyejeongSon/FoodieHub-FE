// src/contexts/UserContext.js
import React, { createContext, useState, useContext } from "react";

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
        
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook으로 Context 사용
export const useUser = () => useContext(UserContext);
