import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ReviewEdit.css";

const StarRating = ({ voteAverage = 0, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(null);
  const rating = hoveredRating || voteAverage;

  const handleClick = (value) => {
    if (onRate) {
      onRate(value); // 선택한 별점을 상위 컴포넌트로 전달
    }
  };
  
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${rating >= star ? "filled" : ""}`}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(null)}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewEdit = () => {
  const navigate = useNavigate();

  const [review, setReview] = useState({
    foodRating: 3,
    priceRating: 3,
    serviceRating: 3,
    hygieneRating: 3,
    comment: "",
    image: null,
  });

  const handleRatingChange = (key, value) => {
    setReview((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCommentChange = (e) => {
    setReview((prev) => ({
      ...prev,
      comment: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReview((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Updated Review:", review);
    navigate("/mypage");
  };

  const handleCancel = () => {
    navigate("/mypage");
  };
  return (
    <div className="review-edit-container">
      <h2>리뷰 수정</h2>
      <div className="review-edit-form">
        <h3>이 가게를 평가해 주세요</h3>
        <div className="rating-section">
          <div className="rating-item">
            <span>음식이 맛있었나요?</span>
            <StarRating
              voteAverage={review.foodRating}
              onRate={(value) => handleRatingChange("foodRating", value)}
            />
          </div>
          <div className="rating-item">
            <span>합리적인 가격이었나요?</span>
            <StarRating
              voteAverage={review.priceRating}
              onRate={(value) => handleRatingChange("priceRating", value)}
            />
          </div>
          <div className="rating-item">
            <span>응대는 만족하셨나요?</span>
            <StarRating
              voteAverage={review.serviceRating}
              onRate={(value) => handleRatingChange("serviceRating", value)}
            />
          </div>
          <div className="rating-item">
            <span>위생 상태는 어땠나요?</span>
            <StarRating
              voteAverage={review.hygieneRating}
              onRate={(value) => handleRatingChange("hygieneRating", value)}
            />
          </div>
        </div>
        <div className="comment-image-container">
          <div className="image-section">
            <label htmlFor="image-upload" className="image-upload-label">
                {review.image ? (
                  <img src={review.image} alt="리뷰 이미지 미리보기" />
                ) : (
                  <div className="image-placeholder">+</div>
                )}
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }} // 파일 업로드 버튼 숨김
              />
            </div>
          
          <div className="comment-section">
            <textarea
              id="comment"
              value={review.comment}
              onChange={handleCommentChange}
              placeholder="리뷰를 입력해주세요."
            />
          </div>
        </div>
        </div>
          <div className="action-buttons">
            <button className="submit-button" onClick={handleSubmit}>
              등록
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              취소
            </button>
          </div>
      </div>
    
  );
};

export default ReviewEdit;
