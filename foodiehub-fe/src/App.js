// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"; // UserProvider import
import Header from "./components/Header"; // 공통 헤더
import Home from "./routes/home/Home";
import Main from "./routes/main/Main";
import Login from "./routes/login/Login";
import MyPage from "./routes/mypage/MyPage";
import SignUp from "./routes/singup/SignUp";
import SignUpAdmin from "./routes/signupadmin/SignUpAdmin";
import EditProfile from "./routes/mypage/EditProfile";

function App() {
    return (
        <Router>
            <UserProvider>
                <ConditionalHeader /> {/* 조건부 헤더 */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signup_admin" element={<SignUpAdmin />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/mypage/edit" element={<EditProfile />} />
                </Routes>
            </UserProvider>
        </Router>
    );
}

function ConditionalHeader() {
    const location = useLocation();

    // 헤더를 숨기고 싶은 경로 배열
    const hiddenPaths = ["/login", "/signup", "/signup_admin"];

    // 현재 경로가 hiddenPaths에 포함되면 Header를 렌더링하지 않음
    return !hiddenPaths.includes(location.pathname) ? <Header /> : null;
}

export default App;
