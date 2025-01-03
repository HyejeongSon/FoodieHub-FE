import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext"; // Context 추가
import useTokenStorage from "../../store/useTokenStorage"; // useTokenStorage를 불러옴
import Carousel from "./Carousel"; // 캐러셀 컴포넌트 불러오기
import StarRating from "../mypage/StarRating";


function Main() {
    const { user } = useUser(); // Context에서 user 가져오기

    useEffect(() => {
        console.log("Main에서 사용자 상태 확인:", user);
    }, [user]); // 상태 변경 시 렌더링 확인


    // URL에서 토큰을 저장하는 훅 호출
    useTokenStorage();

      // 캐러셀 데이터
      const items = [
        {
          title: "갈비찜",
          rating: 4.5,
          intro: "다채로운 양념이 어우러진 최고 요리",
          image: "/img/img_3.jpg",
        },
        {
          title: "짬뽕",
          rating: 4.3,
          intro: "얼큰한 국물과 다양한 해산물이 어우러진 짬뽕",
          image: "/img/img_3.jpg",
        },
        {
          title: "비빔밥",
          rating: 4.8,
          intro: "신선한 채소와 고소한 고추장 소스의 만남",
          image: "/img/img_3.jpg",
        },
        {
          title: "김치찌개",
          rating: 1.6,
          intro: "매콤한 김치와 돼지고기가 어우러진 한국의 대표 찌개",
          image: "/img/img_3.jpg",
          description: "이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜이 갈비찜"
        },
      ];

    return (
        <div>
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
                </div>
            )}
            
            {/* 캐러셀 추가 */}
             <div>
                <Carousel items={items} />
            </div>
              
        </div>
    );
}

export default Main;
