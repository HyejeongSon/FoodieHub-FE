import React, { useState } from "react";
import "../../styles/Review.css";


const ReviewStarRating = ({ voteAverage = 0, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(null);
  const rating = hoveredRating || voteAverage;

  const handleClick = (value) => {
    if (onRate) {
      onRate(value);
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

const Review = () => {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [ratings, setRatings] = useState({
    taste: 0,
    price: 0,
    satisfaction: 0,
    hygiene: 0,
  });
  const [reviewText, setReviewText] = useState("");
  const [previewImage, setPreviewImage] = useState("/img/default-image.png");

  const handleRatingChange = (category, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: value,
    }));
  };

  const handleSubmitReview = () => {
    console.log("평가:", ratings);
    console.log("리뷰 내용:", reviewText);
    alert("리뷰가 제출되었습니다!");
    setIsWritingReview(false);
    setRatings({ taste: 0, price: 0, satisfaction: 0, hygiene: 0 });
    setReviewText("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    setPreviewImage("/img/default-image.png");
  };

  const handleWriteReview = () => {
    setIsWritingReview((prev) => !prev);
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2>푸디허브 리뷰</h2>
        <button className="write-review-btn" onClick={handleWriteReview}>
          {isWritingReview ? "리뷰 작성 닫기 " : "리뷰 쓰기 +"}
        </button>
      </div>

      {isWritingReview && (
        <div className="review-form">
        <h3>이 가게를 평가해주세요</h3>
        
          <div className="rating-item">
            <p>음식이 맛있었나요?</p>
            <div className="star-rating">
              <ReviewStarRating
                voteAverage={ratings.taste}
                onRate={(value) => handleRatingChange("taste", value)}
              />
            </div>
          </div>
            <div className="rating-item">
              <p>합리적인 가격이었나요?</p>
              <ReviewStarRating
                voteAverage={ratings.price}
                onRate={(value) => handleRatingChange("price", value)}
              />
            </div>
            <div className="rating-item">
              <p>응대는 만족하셨나요?</p>
              <ReviewStarRating
                voteAverage={ratings.satisfaction}
                onRate={(value) => handleRatingChange("satisfaction", value)}
              />
            </div>
            <div className="rating-item">
              <p>위생 상태는 어땠나요?</p>
              <ReviewStarRating
                voteAverage={ratings.hygiene}
                onRate={(value) => handleRatingChange("hygiene", value)}
              />
            </div>
        

          <div className="text-area-section">
            <div className="image-section">
              <label htmlFor="image-upload" className="image-upload-label">
                <img
                  src={previewImage}
                  alt="리뷰 이미지 미리보기"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </label>
            </div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            {previewImage !== "/img/default-image.png" && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="delete-image-button"
              >
                ✖
              </button>
            )}
            <textarea
              placeholder="리뷰를 작성하세요..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          <button className="submit-review-btn" onClick={handleSubmitReview}>
            작성 완료
          </button>
        </div>
      )}
      <div>
      </div>
    </div>
  );
};

export default Review;
