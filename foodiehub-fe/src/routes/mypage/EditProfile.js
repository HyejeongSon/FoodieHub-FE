import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {httpRequest} from "../../store/httpRequest";
import {useUser} from "../../contexts/UserContext";

const EditProfile = () => {
    const navigate = useNavigate();
    const {user,setUser} = useUser();
    const [profile, setProfile] = useState({
        nickname: "",
        email: "",
        phone: "",
        currentPassword:"",//현재 비밀번호
        newPassword:"",//새 비밀번호호
    });

    // 입력 필드 핸들러
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setProfile({
    //         ...profile,
    //         [name]: value, // 동적으로 필드 업데이트
    //     });
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setProfile((prevProfile) => ({
    //         ...prevProfile,
    //         [name]: value, // 입력 필드의 name을 기반으로 상태 업데이트
    //     }));
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("hadleChange!!!!!")
        setProfile((prevProfile) => {
            const updatedProfile = {
                ...prevProfile,
                [name]: value, // 입력 필드의 name을 기반으로 상태 업데이트
            };
            console.log("handleChange 업데이트 상태:", updatedProfile); // 디버깅 로그
            return updatedProfile;
        });
    };
    

    useEffect(() => {
        console.log("EditProfile에서 사용자 상태 확인:", user);
    }, [user]); // 상태 변경 시 렌더링 확인

    useEffect(() => {
        console.log("Profile 상태:", profile);
    }, [profile]); //값이 변경될 때 console.log(profile)로 상태가 업데이트되는지 확인인    
    



    // user 상태가 변경될 때 profile 동기화
    useEffect(() => {
        if (user) {
            setProfile({
                nickname: user.nickname || "",
                email: user.email || "",
                phone: user.cellphone || "",
            });
        }
    }, [user]);

    // 사용자 정보 동기화 , 서버에서 사용자 데이터 가져오기기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await httpRequest("GET", "/api/auth/me");
                // 사용자 상태 업데이트
                setUser({
                    userid: userInfo.userid,
                    cellphone : userInfo.cellphone,
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

        // // 사용자 정보가 없는 경우만 동기화
        if (!user.nickname || !user.email) {
            fetchUserData();
        }
    },  [user, setUser]); // user와 setUser를 종속성 배열에 포함



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("수정된 회원정보:", profile);
        try {
            // 서버로 회원 정보 전송
            const response = await httpRequest("POST", "/api/user/update-profile", profile);
    
            if (response.success) { // 서버가 성공적으로 처리한 경우
                alert(response.message);
                // 수정된 데이터로 상태 업데이트
                setUser((prevUser) => ({
                    ...prevUser,
                    nickname: profile.nickname,
                    cellphone: profile.phone,
                }));
                
                // 비밀번호 필드 초기화
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    currentPassword: "", // 현재 비밀번호 초기화
                    newPassword: "", // 새 비밀번호 초기화
                }));
            } else {
                throw new Error(response.message || "회원정보 저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원정보 저장 중 오류 발생:", error);
            alert("회원정보 저장에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div>
            <h2>회원정보 수정</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        readOnly // 수정 불가능하게 설정
                    />
                </div>
                
                <div>
                    <label>닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={profile.nickname}
                        onChange={handleChange}
                    />
                </div>
   
                <div>
                    <label>전화번호</label>
                    <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                    />
                </div>
                { user.provider =="local" &&
                <div>
                    <label>현재 비밀번호</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={profile.currentPassword}
                        onChange={handleChange}
                    />
                </div>
                }
                { user.provider =="local" &&
                <div>
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={profile.newPassword}
                        onChange={handleChange}
                    />
                </div>
                }
                <button type="submit">저장</button>
            </form>

            {/* 마이페이지로 이동 버튼 */}
            <button onClick={() => navigate('/mypage')} style={{ marginTop: "10px" }}>
                마이페이지로 돌아가기
            </button>
        </div>
    );
};

export default EditProfile;
