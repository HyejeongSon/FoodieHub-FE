// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"; // UserProvider import
import Header from "./components/Header"; // 공통 헤더
import Home from "./routes/home/Home";
import Main from "./routes/main/Main";
import Login from "./routes/login/Login";
import LoginAdmin from "./routes/login/LoginAdmin";
import MyPage from "./routes/mypage/MyPage";
import SignUp from "./routes/singup/SignUp";
import SignUpAdmin from "./routes/signupadmin/SignUpAdmin";
import EditProfile from "./routes/mypage/EditProfile"
import ReviewEdit from "./routes/mypage/ReviewEdit";
import MyStore from "./routes/mystore/MyStore";
import StoreDetail from "./routes/storedetail/StoreDetail";

import StoreRegister from "./routes/mystore/StoreRegister";
import EditMyStore from "./routes/mystore/EditMyStore";

function App() {
    return (
        <Router>
            <UserProvider>

                <ConditionalHeader /> {/* 조건부 헤더 */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login_admin" element={<LoginAdmin />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signup_admin" element={<SignUpAdmin />} />
                    <Route path="/store_register" element={<StoreRegister />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/mypage/edit" element={<EditProfile />} />
                    <Route path="/mystore" element={<MyStore />} />
                    <Route path="/mypage/reviewedit/:reviewId" element={<ReviewEdit />} />
                    <Route path="/storedetail" element={<StoreDetail />} />
                    <Route path="/mystore/edit" element={<EditMyStore />} />
                    <Route path="/mypage/reviewedit" element={<ReviewEdit />} />
                </Routes>
           </UserProvider>
        </Router>
    );
}

function ConditionalHeader() {
    const location = useLocation();

    // 헤더를 숨기고 싶은 경로 배열
    const hiddenPaths = ["/login", "/signup", "/signup_admin","/login_admin"];

    // 현재 경로가 hiddenPaths에 포함되면 Header를 렌더링하지 않음
    return !hiddenPaths.includes(location.pathname) ? <Header /> : null;
}

export default App;
