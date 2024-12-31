import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useUser} from "../../contexts/UserContext";
import axios from "axios";
import { getProfile } from "../../store/UserStore";


const EditProfile = () => {
    const navigate = useNavigate();
    const {user, setUser} = useUser();// Context에서 user와 setUser 가져오기 //useState(null); // 초기 상태가 null로 설정됨
    // 프로필 정보 상태
    const [profile, setProfile] = useState({
        nickname: "",
        email: "",
        cellphone: "",
        currentPassword:"",//현재 비밀번호
        newPassword:"",//새 비밀번호
    });

    const [profileImage,setProfileImage] = useState(null); // 프로필 이미지 파일
    const [imagePreview,setImagePreview] = useState(user?.profileimageurl ||"/img/default-profile.png"); // 미리보기

    // 로딩 상태값 추가
    const [isLoading,setIsLoading] = useState(false);

    // 입력 필드 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => {
            const updatedProfile = {
                ...prevProfile,
                [name]: value, // 입력 필드의 name을 기반으로 상태 업데이트
            };
            return updatedProfile;
        });
    };

    // 프로필 이미지 핸들러
    const handleImageChange = (e) =>{
        const file = e.target.files[0];
        
        if(file){
            // 파일 크기 제한 (5MB 이하)
            if(file.size > 5 * 1024 * 1024){
                alert("파일 크기는 5MB를 초과할 수 없습니다.");
                return;
            }

            // 파일 확장자 유효성 검사
            const allowedExtensions =/(\.jpg|\.jpeg|\.png)$/i;
            if(!allowedExtensions.test(file.name)){
                alert('jpg,jpeg,png 형식의 파일만 업로드 할 수 있습니다.');
                return;
            }

            setProfileImage(file);
            
            // 파일 미리보기 설정
            const reader  = new FileReader();
            reader.onload = (event) =>{
                setImagePreview(event.target.result); // 미리보기 업데이트
            };
            reader.readAsDataURL(file);
        }
    }
    useEffect(() => {
        console.log("EditProfile에서 사용자 상태 확인:", user);
    }, [user]); // 상태 변경 시 렌더링 확인

    useEffect(() => {
        console.log("Profile 상태:", profile);
    }, [profile]); //값이 변경될 때 console.log(profile)로 상태가 업데이트되는지 확인    

    // 사용자 정보 로드시 프로필 상태 초기화
    // user 상태가 변경될 때 profile 동기화 , 사용자 정보 동기화
    useEffect(() => {
        if (user) {
            console.log("user 상태:", user);
            setProfile({
                nickname: user.nickname || "",
                cellphone: user.cellphone || "",
            });
            console.log("profileimageurl 상태:", user.profileimageurl);
            console.log("이미지 경로:", imagePreview);
            if(user?.profileimageurl){
                setImagePreview(user.profileimageurl);
            }
        }
    }, [user]);
    
    
    const fetchUserProfile = async () => {
        console.log("fetchUserProfile!!!!!!!!!!!!!!!!!!!");
        setIsLoading(true);
        try {
            const response = await getProfile("GET","/api/user/profile");
            console.log("@@@API 응답:", response); // API 호출 결과 확인

            if (response.success) {
                const userData = response.user;
                console.log("@@@user 데이터?",userData);
                setProfile({
                    nickname: userData.nickname || "",
                    email: userData.email || "",
                    cellphone: userData.cellphone || "",
                });
                setImagePreview(userData.profileimageurl || "/img/default-profile.png");
            } else {
                console.error("API 실패 응답:", response); // 실패 시 응답 확인
                throw new Error("사용자 정보를 가져오는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
            alert("사용자 정보를 가져오는 중 문제가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const initializeProfile = async () => {
            // 항상 서버에서 최신 데이터 가져오기
            await fetchUserProfile();
        };
    
        initializeProfile();

    }, []);


    // 회원정보 저장
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // 로딩 시작
        try {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append("nickname",profile.nickname);
            formData.append("email", profile.email); // 이메일 필드 추가
            formData.append("cellphone",profile.cellphone);
            
            // 현재 비밀번호와 새 비밀번호 추가
            if(profile.currentPassword) formData.append("currentPassword", profile.currentPassword);
            if(profile.newPassword) formData.append("newPassword",profile.newPassword);
            
            // if(profileImage) formData.append("profileImage",profileImage); // 파일 추가
            // 이미지가 수정된 경우
            if (profileImage) {
                formData.append("profileImage", profileImage); // 새 이미지를 추가
            } else {
                formData.append("existingImageUrl", imagePreview); // 기존 이미지를 서버로 전달
            }

            console.log("FormData 확인:", Array.from(formData.entries()));

            // 서버로 회원 정보 전송
            const response = await axios.post("/api/user/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            console.log("서버로 전송",localStorage.getItem('access_token'));
            if (response.data.success) { // 서버가 성공적으로 처리한 경우
                alert(response.data.message);
                console.log("서버 응답 데이터:", response.data);
                // 서버에서 반환된 프로필 이미지 URL로 상태 및 미리보기 업데이트
                const updatedProfileImageUrl = response.data.profileimageurl || "/img/default-profile.png";

                // 수정된 데이터로 상태 업데이트
                setUser((prevUser) => ({
                    ...prevUser,
                    nickname: profile.nickname,
                    cellphone: profile.cellphone,
                    profileimageurl : updatedProfileImageUrl, // 새로운 URL 반영
                }));
                
                setImagePreview(updatedProfileImageUrl); // 미리보기 즉시 업데이트

                // 비밀번호 필드 초기화
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    currentPassword: "", // 현재 비밀번호 초기화
                    newPassword: "", // 새 비밀번호 초기화
                }));

                //  수정 후 사용자 정보 재요청
                await fetchUserProfile(); // 최신 데이터 동기화
            } else {
                throw new Error(response.message || "회원정보 저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원정보 저장 중 오류 발생:", error);
            alert("회원정보 저장에 실패했습니다. 다시 시도해주세요.");
        }finally{
            setIsLoading(false); // 로딩 종료
        }
    };


    if (isLoading) {
        return <p>로딩 중...</p>;
    }
    
    
    return (
        <div>
            <h2>회원정보 수정</h2>
            {isLoading && <p>저장 중입니다...</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>프로필 사진</label>
                    <div style={{ 
                        position: "relative", // 부모 요소에 상대 위치 설정
                        width: "150px",
                        height: "150px",
                        margin: "20px auto", // 중앙 정렬                        
                        marginBottom: "10px" }}>
                        <img
                            src={imagePreview}
                            alt="프로필 사진 미리보기"
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />

                        {/* 이미지 변경 버튼 */}
                        <label
                            htmlFor="imageUpload"
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            ✏️
                        </label>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </div>
                    {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
                </div>

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
                        name="cellphone"
                        value={profile.cellphone}
                        onChange={handleChange}
                    />
                </div>
                { user?.provider =="local" &&
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
                { user?.provider =="local" &&
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

            <button onClick={() => navigate('/mypage')} style={{ marginTop: "10px" }}>
                마이페이지로 돌아가기
            </button>
        </div>
    );
};

export default EditProfile;
