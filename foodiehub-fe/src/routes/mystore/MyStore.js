import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MyStore.css";
import { getDetails } from "../../store/StoreStore";
import StarRating from "../mypage/StarRating";

const MyStore = () =>{
    const navigate = useNavigate();
    const [myStoreDetails, setMyStoreDetails] =useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [reviews, setReviews] = useState([
        {
          id: 1,
          date: "2024-12-10",
          text: "리뷰 내용이 여기에 들어갑니다. 리뷰 내용이 길 경우, 텍스트가 잘 정렬되도록 처리됩니다.",
          score: 3.5,
          image: "#",
        },
        {
          id: 2,
          date: "2024-12-10",
          text: "이 식당의 평균 별점입니다.",
          score: 4.5,
          image: "#",
        },
      ]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
    const [selectedItem, setSelectedItem] = useState(null); // 삭제할 항목 상태
    
    // API 호출 함수
    const fetchDeleteReview = async (id) => {
        try {
        const response = await fetch(`/api/reviews/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("리뷰 삭제 요청 실패");
        }

        return true;
        } catch (error) {
        console.error("리뷰 삭제 중 오류 발생:", error);
        return false;
        }
    };

    // 삭제 확인 함수
    const confirmDelete = async () => {
        try {
        const response = await fetchDeleteReview(selectedItem.id);
        if (response) {
            setReviews((prev) => prev.filter((review) => review.id !== selectedItem.id));
        }
        setIsDeleteModalOpen(false); // 삭제 모달 닫기
        setSelectedItem(null); // 선택 항목 초기화
        } catch (err) {
        console.error("삭제 중 오류 발생:", err);
        alert("삭제에 실패했습니다.");
        }
    };

    // 삭제 기능
    const handleDelete = (item) => {
        setSelectedItem(item); // 삭제하려는 항목 설정
        setIsDeleteModalOpen(true); // 삭제 모달 열기
    };

    // 삭제 취소
    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // 삭제 모달 닫기
        setSelectedItem(null); // 선택 항목 초기화
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
      };

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

    return (
        <div className="admin-mypage-container">
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
                <> 
                {/* 헤더 */}
                <div className="store-header">
                    <h1 className="store-name">
                    {myStoreDetails.details.name}
                    <button className="store-edit-button" onClick={() => navigate("/mystore/edit")}>
                        <img
                        src="/img/settings.png"
                        alt="설정 아이콘"
                        className="edit-icon"
                        />
                        수정하기
                    </button>
                    </h1>
                    <h2 className="store-subtitle">우리 식당 평균 별점</h2>
                    <div className="store-rating">
                    <span className="stars"><StarRating key={1} num={myStoreDetails.details.averageTasteRating}/></span> <span> {myStoreDetails.details.averageTasteRating}/5</span> 
                    <p className="more-button" onClick={toggleDetails}>
                        {showDetails ? "접기" : "더 보기"}
                    </p>
                    </div>
                </div>

                {/* 세부 평점 섹션 */}
                {showDetails && (
                    <div className="details-section">
                    <h2 className="details-title">항목별 평점</h2>
                    <div className="details-grid">
                        <div key={2} className="details-item">
                            <p className="details-category">식당 맛 평균 별점</p>
                            <div className="details-score">
                                <span className="stars"><StarRating num={myStoreDetails.details.averageTasteRating}/></span>
                                <span>{myStoreDetails.details.averageTasteRating}/5</span>
                            </div>
                        </div>
                        <div key={3} className="details-item">
                            <p className="details-category">식당 위생 평균 별점</p>
                            <div className="details-score">
                                <span className="stars"><StarRating num={myStoreDetails.details.averageCleanRating}/></span>
                                <span>{myStoreDetails.details.averageCleanRating}/5</span>
                            </div>
                        </div>
                        <div key={4} className="details-item">
                            <p className="details-category">친절도 평균 별점</p>
                            <div className="details-score">
                                <span className="stars"><StarRating num={myStoreDetails.details.averageFriendlyRating}/></span>
                                <span>{myStoreDetails.details.averageFriendlyRating}/5</span>
                            </div>
                        </div>
                        <div key={5} className="details-item">
                            <p className="details-category">가격 평균 별점</p>
                            <div className="details-score">
                                <span className="stars"><StarRating num={myStoreDetails.details.averagePriceRating}/></span>
                                <span>{myStoreDetails.details.averagePriceRating}/5</span>
                            </div>
                        </div>
                    </div>
                    </div> 
                )}
                
                {/* 리뷰 섹션 */}
                <div className="review-section">
                    <h2 className="store_review_list">가게 리뷰({reviews.length})</h2>
                    {/* 리뷰 항목들 */}
                    {reviews.map((review) => (
                        <div key={review.id} className="adminreview-item">
                            {/* 왼쪽 이미지 */}
                            <div className="review-left">
                            <img src={review.image} alt="리뷰 이미지" className="review-image" />
                            </div>

                            {/* 오른쪽 내용 */}
                            <div className="review-right">
                            {/* 리뷰 헤더 */}
                            <div className="review-header">
                                <p className="customer_review_title">리뷰 제목</p>
                                <p><StarRating /> /5</p>
                            </div>
                            <div className="date-del-section">
                                <p className="date">Date: {review.date}</p>
                                <button className="store-review-del-button" onClick={handleDelete}>
                                <img
                                    src="/img/del.png"
                                    alt="삭제 아이콘"
                                    className="del-icon"
                                />
                                </button>
                            </div>
                            {/* 리뷰 내용 */}
                            <div className="customer-review-content">
                                <p className="text">{review.text}</p>
                            </div>
                            </div>
                        </div>
                        ))}
                </div>
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
                </>
            )}
            
        </div>
    );
};

const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>정말로 삭제하시겠습니까?</p>
          <div className="modal-buttons">
            <button onClick={onConfirm}>확인</button>
            <button onClick={onCancel}>취소</button>
          </div>
        </div>
      </div>
    );
  };

export default MyStore;