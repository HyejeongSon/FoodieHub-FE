import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MyStore.css";
import { getDetails } from "../../store/StoreStore";


const MyStore = () =>{
    const navigate = useNavigate();
    const [myStoreDetails,setMyStoreDetails] =useState(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false); // 토글 상태

    const fetchMyStoreDetails = async() => {
        try{
            const details = await getDetails("GET","/api/mystore/details");

            console.log("details:",details);
            setMyStoreDetails(details); // 상태 업데이트
        }catch(error){
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };
    useEffect(() => {
        console.log("useEffect 실행됨"); // 호출 여부 확인
        const fetchDetails = async () => {
            try {
                await fetchMyStoreDetails();
            } catch (error) {
                console.error("MyStoreDetails 오류", error);
            }
        };
        fetchDetails(); // 비동기 함수 호출
    }, []);

    useEffect(() => {
        console.log("myStoreDetails 업데이트됨:", myStoreDetails);
    }, [myStoreDetails]);
    
    const toggleDetailsVisibility = () => {
        setIsDetailsVisible((prev) => !prev); // 토글 상태 변경
    };

    return (
        <div className="mystore-container">
            {myStoreDetails && !myStoreDetails.isStore && (
                <div className="register-container">
                    <img
                        src="/img/MyStoreAlert.png" // 여기에 이미지 경로 추가
                        alt="등록 알림"
                        className="register-image"
                    />
                    <h1
                        // className="underline-link"
                        className="store-register-text"
                        onClick={() => navigate("/store_register")}
                    >
                        가게를 등록해주세요
                    </h1>
                </div>
                
                
            )}

            {myStoreDetails && myStoreDetails.isStore && (
                <div>
                    <h1>{myStoreDetails.details.name}</h1>
                    <button type="button" onClick={() => navigate("/mystore/edit")}>
                        가게 수정
                    </button>
                </div>
            )}
            {myStoreDetails && myStoreDetails.isStore && (
                <div>
                    <p>우리 식당 평균 별점</p>
                    <p>⭐ {myStoreDetails.details.averageTotalRating}/5</p>
                </div>
            )}

            {myStoreDetails && myStoreDetails.isStore && (
                <div>
                    <h3 onClick={toggleDetailsVisibility} style={{ cursor: "pointer" }}>
                        세부 평가 {isDetailsVisible ? "⬆️" : "⬇️"}
                    </h3>
                    {isDetailsVisible && (
                        <div>
                            <p>
                                식당 맛 평균 별점: ⭐{" "}
                                {myStoreDetails.details.averageTasteRating}/5
                            </p>
                            <p>
                                식당 위생 평균 별점: ⭐{" "}
                                {myStoreDetails.details.averageCleanRating}/5
                            </p>
                            <p>
                                친절도 평균 별점: ⭐{" "}
                                {myStoreDetails.details.averageFriendlyRating}/5
                            </p>
                            <p>
                                가격 평균 별점: ⭐{" "}
                                {myStoreDetails.details.averagePriceRating}/5
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyStore;