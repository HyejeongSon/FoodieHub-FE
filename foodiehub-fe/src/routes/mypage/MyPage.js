// src/pages/MyPage/MyPage.js
import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {httpRequest} from "../../store/httpRequest";
import { useUser } from "../../contexts/UserContext"; // Context 추가


const MyPage = () => {
    const navigate = useNavigate();
    // const { user, setUser } = useUser(); // Context에서 가져오기
    // const [imagePreview,setImagePreview] = useState(user?.profileimageurl ||"/img/default-profile.png"); // 미리보기
    const { user, fetchUser } = useUser();

    useEffect(() => {
        console.log("MyPage에서 사용자 상태 확인:", user);
    }, [user]); // 상태 변경 시 렌더링 확인

    // // 사용자 정보 동기화
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const userInfo = await httpRequest("GET", "/api/auth/me");
    //             console.log("사용자 상태 업데이트",userInfo);
    //             // 사용자 상태 업데이트
    //             // setUser(userInfo); // 최신 사용자 정보로 상태 업데이트
    //             // 기존 상태와 새 데이터를 비교 후 업데이트
    //             setUser((prevUser) => {
    //                 if (
    //                     prevUser &&
    //                     prevUser.email === userInfo.email &&
    //                     prevUser.nickname === userInfo.nickname &&
    //                     prevUser.cellphone === userInfo.cellphone &&
    //                     prevUser.profileimageurl === userInfo.profileimageurl
    //                 ) {
    //                     console.log("기존 상태와 동일하면 업데이트하지 않음",prevUser);
    //                     return prevUser; // 기존 상태와 동일하면 업데이트하지 않음
    //                 }
    //                 console.log("이미지달라짐",userInfo.profileimageurl);
    //                 setImagePreview(userInfo.profileimageurl);
    //                 return userInfo; // 상태가 변경된 경우만 업데이트
                    
    //             });
    //         } catch (error) {
    //             console.error("GET /api/auth/me 실패:", error);
    //         }
    //     };
        
    //     // 항상 호출하되, 내부에서 상태를 비교
    //     fetchUserData();
        
    // }, [user]); // 빈 배열로 설정하여 초기 렌더링 시 한 번만 실행



    return (
        <div>
            <img
                src={user.profileimageurl}
                alt="프로필 사진 미리보기"
                style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    objectFit: "cover",
                }}
            />
            <p>닉네임 <b>{user.nickname}</b></p>
            <p>아이디 <b>{user.email}</b></p>
            <button type="button" onClick={() =>navigate("/mypage/edit")}>회원정보수정</button>
        </div>
    );
};

export default MyPage;
