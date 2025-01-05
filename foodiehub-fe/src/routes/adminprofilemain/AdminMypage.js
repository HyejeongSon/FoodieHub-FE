import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminMypage.css";
import StarRating from "../mypage/StarRating";
import StarRate from "../mypage/StarRating";

const AdminMypage = () => {
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
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate(); // 페이지 이동 훅 초기화

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

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

  const cancelDelete = () => {
    setIsDeleteModalOpen(false); // 삭제 모달 닫기
    setSelectedItem(null); // 선택 항목 초기화
  };

  const detailedRatings = [
    { category: "식당 및 평균 별점", score: 4.5 },
    { category: "식당 위생 평균 별점", score: 4.5 },
    { category: "친절도 평균 별점", score: 4.5 },
    { category: "가격 평균 별점", score: 4.5 },
  ];

  const handleEdit = () => {
    navigate("/mystore/edit"); // 수정 페이지로 이동
  };

  return (
    <div className="admin-mypage-container">
      {/* 헤더 */}
      <div className="store-header">
        <h1 className="store-name">
          신설동 육전 식당
          <button className="store-edit-button" onClick={handleEdit}>
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
          <span className="stars"><StarRating /></span> <span>4.5/5</span> 
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
            {detailedRatings.map((rating, index) => (
              <div key={index} className="details-item">
                <p className="details-category">{rating.category}</p>
                <div className="details-score">
                  <span className="stars"><StarRating /></span>
                  <span>{rating.score}/5</span>
                </div>
              </div>
            ))}
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

export default AdminMypage;
