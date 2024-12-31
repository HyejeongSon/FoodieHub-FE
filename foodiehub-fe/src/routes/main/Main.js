import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext"; // Context 추가
import useTokenStorage from "../../store/useTokenStorage"; // useTokenStorage를 불러옴

function Main() {
    const { user } = useUser(); // Context에서 user 가져오기

    useEffect(() => {
        console.log("Main에서 사용자 상태 확인:", user);
    }, [user]); // 상태 변경 시 렌더링 확인


    // URL에서 토큰을 저장하는 훅 호출
    useTokenStorage();


    return (
        <div>
            <h1>메인 페이지 테스트 페이지 !!!</h1>

            {/* 조건부 렌더링: 사용자 정보 */}
            {user.nickname ? (
                <div>
                    <p>사용자 이름: <b>{user.name}</b></p>
                    <p>사용자 닉네임: <b>{user.nickname}</b></p>
                    <p>사용자 권한: <b>{user.role}</b></p>
                    {user.role === "ROLE_ADMIN" && <p>관리자 권한이 있습니다.</p>}
                </div>
            ) : (
                <div>
                    <p>로그인하지 않은 사용자만 볼 수 있습니다.</p>
                </div>
            )}
        </div>
    );
}

export default Main;
