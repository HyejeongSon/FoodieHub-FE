import React, { useState } from "react";
import "../../styles/Review.css";

const Review = () => {
  const [isWritingReview, setIsWritingReview] = useState(false);

  const reviews = [
    { id: 1, name: "닉네임1", date: "2024-12-10", rating: 3.5, likes: 3, content: "리뷰 내용입니다." },
    { id: 2, name: "닉네임2", date: "2024-12-09", rating: 4.0, likes: 5, content: "리뷰 내용입니다." },
    { id: 3, name: "닉네임3", date: "2024-12-08", rating: 4.5, likes: 2, content: "리뷰 내용입니다." },
    { id: 4, name: "닉네임4", date: "2024-12-07", rating: 5.0, likes: 10, content: "리뷰 내용입니다." },
  ];

  const handleWriteReview = () => {
    setIsWritingReview((prev) => !prev);
  };

  return (
    <div className="reviews-container">
      {/* 리뷰 헤더 */}
      <div className="reviews-header">
        <h2>푸디허브 리뷰</h2>
        <button className="write-review-btn" onClick={handleWriteReview}>
          {isWritingReview ? "리뷰 작성 닫기 -" : "리뷰 쓰기 +"}
        </button>
      </div>

      {/* 리뷰 작성란 */}
      {isWritingReview && (
        <div className="review-form">
          <textarea placeholder="리뷰를 작성하세요..." />
          <button className="submit-review-btn">작성 완료</button>
        </div>
      )}

      {/* 리뷰 리스트 */}
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <p className="review-name">{review.name}</p>
              <p className="review-date">{review.date}</p>
            </div>
            <div className="review-rating">
              ⭐ {review.rating} / 5
            </div>
            <p className="review-content">{review.content}</p>
            <p className="review-likes">❤️ 좋아요 {review.likes}개</p>
          </div>
        ))}
      </div>

      {/* 리뷰 더보기 버튼 */}
      <div className="reviews-footer">
        <button className="load-more-btn">리뷰 더 보기 +</button>
      </div>
    </div>
  );
};

export default Review;
