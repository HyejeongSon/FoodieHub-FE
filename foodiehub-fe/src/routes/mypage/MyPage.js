// src/pages/MyPage/MyPage.js
import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {httpRequest} from "../../store/httpRequest";
import { useUser } from "../../contexts/UserContext"; // Context 추가


const MyPage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser(); // Context에서 가져오기

    useEffect(() => {
        console.log("MyPage에서 사용자 상태 확인:", user);
    }, [user]); // 상태 변경 시 렌더링 확인

    // 사용자 정보 동기화
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await httpRequest("GET", "/api/auth/me");
                // setUser({ username : data.username, nickname: data.nickname, email: data.email });
                // 사용자 상태 업데이트
                setUser({
                    email: userInfo.email,
                    name : userInfo.name,
                    nickname : userInfo.nickname,
                    provider : userInfo.provider,
                    role: userInfo.role || "ROLE_USER",
                });

            } catch (error) {
                console.error("GET /api/auth/me 실패:", error);
            }
        };

        // 사용자 정보가 없는 경우만 동기화
        if (!user.nickname || !user.email) {
            fetchUserData();
        }
    },  [user, setUser]); // user와 setUser를 종속성 배열에 포함



    return (
        <div>
        <hr className="divider" />
            <p>닉네임 <b>{user.nickname}</b></p>
            <p>아이디 <b>{user.email}</b></p>
            <button className="button" type="button" onClick={() =>navigate("/mypage/edit")}>회원정보수정</button>
        </div>
    );
};

export default MyPage;
