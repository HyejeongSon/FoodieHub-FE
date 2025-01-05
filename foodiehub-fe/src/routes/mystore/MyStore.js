import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MyStore.css";
import { getDetails } from "../../store/StoreStore";
import StarRating from "../mypage/StarRating";

const MyStore = () =>{
    const navigate = useNavigate();
    const [myStoreDetails, setMyStoreDetails] =useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
    const [selectedItem, setSelectedItem] = useState(null); // 삭제할 항목 상태
    
    const fetchStoreReviews = async (storeId) => {
        try {
            const response = await fetch(`/api/review/mystore/${storeId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error("리뷰 데이터를 가져오는데 실패했습니다.");
            }
    
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
        }
    };
    
    useEffect(() => {
        if (myStoreDetails && myStoreDetails.details && myStoreDetails.details.id) {
            fetchStoreReviews(myStoreDetails.details.id);
        }
    }, [myStoreDetails]);

    // API 호출 함수
    const fetchDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`/api/review/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error("리뷰 삭제 요청 실패");
            }
    
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("리뷰 삭제 중 오류 발생:", error);
            return false;
        }
    };

    // 삭제 확인 함수
    const confirmDelete = async () => {
        if (!selectedItem) return; // 선택된 항목이 없으면 종료
        try {
            const response = await fetchDeleteReview(selectedItem.id);
            if (response) {
                setReviews((prev) => prev.filter((review) => review.id !== selectedItem.id)); // 리뷰 삭제 후 목록 갱신
            }
            setIsDeleteModalOpen(false); // 삭제 모달 닫기
            setSelectedItem(null); // 선택 항목 초기화
        } catch (err) {
            console.error("삭제 중 오류 발생:", err);
            alert("삭제 처리 중 문제가 발생했습니다.");
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

            console.log("details:", details);
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
                    {reviews.length === 0 && ( <p className="no-reviews-message">리뷰가 없습니다.</p>) }
                    {/* 리뷰 항목들 */}
                    {reviews.map((review) => (
                        <div key={review.id} className="adminreview-item">
                            {/* 왼쪽 이미지 */}
                            {review.reviewImage && (
                            <div className="review-left">
                            <img src={`/api/review/image/${review.reviewImage}` || "/img/default-review.png"} alt="리뷰 이미지" className="review-image" />
                            </div>) }

                            {/* 오른쪽 내용 */}
                            <div className="review-right">
                            {/* 리뷰 헤더 */}
                            <div className="review-header">
                                <p className="customer_review_title">{review.nickname}</p>
                                <p><StarRating key={review.id} id={review.id} num={review.avgRating} /> {review.avgRating}/5</p>
                            </div>
                            <div className="date-del-section">
                                <p className="date">Date: {new Date(review.createDate).toLocaleDateString()}</p>
                                <button className="store-review-del-button" onClick={() => handleDelete(review)}>
                                <img
                                    src="/img/del.png"
                                    alt="삭제 아이콘"
                                    className="del-icon"
                                />
                                </button>
                            </div>
                            {/* 리뷰 내용 */}
                            <div className="customer-review-content">
                                <p className="text">{review.content}</p>
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