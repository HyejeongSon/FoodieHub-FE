// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"; // UserProvider import
import Header from "./components/Header"; // 공통 헤더
import Home from "./routes/home/Home";
import Main from "./routes/main/Main";
import Login from "./routes/login/Login";
import MyPage from "./routes/mypage/MyPage";
import SignUp from "./routes/singup/SignUp";
import SignUpAdmin from "./routes/signupadmin/SignUpAdmin";
import EditProfile from "./routes/mypage/EditProfile"
import Register from "./components/Register";

function App() {
    // const [user, setUser] = useState({ username: "", role: "" }); // 사용자 상태 최상위에서 관리
    //
    // useEffect(() => {
    //     console.log("App.js의 현재 사용자 상태:", user);
    // }, [user]); // 상태 변경 시 확인
    return (
<<<<<<< HEAD
        <Router>
            <UserProvider>
                <Header />
=======
        <UserProvider>
            <Router>
>>>>>>> yonggi1227
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
  //   return (
  //     <Router>
  //         {/* 상태와 상태 변경 함수를 Header와 Main에 전달 */}
  //         <Header user={user} setUser={setUser} />
  //         <Routes>
  //           <Route path="/" element={<Home />} />
  //           <Route path="/main" element={<Main user={user} setUser={setUser} />} /> {/* Main에 상태 전달 */}
  //           <Route path="/login" element={<Login setUser={setUser} />} /> {/* Login에서도 상태 업데이트 가능 */}
  //           <Route path="/signup" element={<SignUp />} />
  //           <Route path="/signup_admin" element={<SignUpAdmin />} />
  //           <Route path="/mypage" element={<MyPage />} />
  //           <Route path="/mypage/edit" element={<EditProfile/>} />
  //
  //       </Routes>
  //     </Router>
  // );
}

export default App;
