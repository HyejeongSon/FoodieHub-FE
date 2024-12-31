// src/pages/MyPage/MyPage.js
import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext"; // Context 추가


const MyPage = () => {
    const navigate = useNavigate();
    // const { user, setUser } = useUser(); // Context에서 가져오기
    // const [imagePreview,setImagePreview] = useState(user?.profileimageurl ||"/img/default-profile.png"); // 미리보기
    const { user, fetchUser } = useUser();

    useEffect(() => {
        console.log("MyPage에서 사용자 상태 확인:", user);
    }, [user]); // 상태 변경 시 렌더링 확인

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
            <button className="button" type="button" onClick={() =>navigate("/mypage/edit")}>회원정보수정</button>
        </div>
    );
};

export default MyPage;
