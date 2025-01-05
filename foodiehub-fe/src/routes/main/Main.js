import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext"; // Context 추가
import useTokenStorage from "../../store/useTokenStorage"; // useTokenStorage를 불러옴
import Carousel from "./Carousel"; // 캐러셀 컴포넌트 불러오기

function Main() {
    const { user } = useUser(); // Context에서 user 가져오기

    useEffect(() => {
        console.log("Main에서 사용자 상태 확인:", user);
    }, [user]); // 상태 변경 시 렌더링 확인
  
    useTokenStorage(); // URL에서 토큰을 저장하는 훅 호출

    return (
        <div>
            {/* 캐러셀 추가 */}
             <div>
                <Carousel />
            </div>
        </div>
    );
}

export default Main;
