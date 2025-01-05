import React, { useState } from "react";
import { useParams } from "react-router-dom";
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

const Review = ({ onReviewSubmitted }) => {
  const { storeId } = useParams();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [ratings, setRatings] = useState({
    tasteRating: 0,
    priceRating: 0,
    cleanRating: 0,
    friendlyRating: 0,
  });
  const [reviewText, setReviewText] = useState("");
  const [previewImage, setPreviewImage] = useState("/img/default-image.png");
  const [imageFile, setImageFile] = useState(null);

  const handleRatingChange = (category, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: value,
    }));
  };

  const handleSubmitReview = async () => {

    if (Object.values(ratings).some((rating) => rating === 0)) {
      alert("모든 평가 항목에 별점을 입력해주세요.");
      return;
    }

    if (!reviewText.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("tasteRating", ratings.tasteRating);
      formData.append("priceRating", ratings.priceRating);
      formData.append("cleanRating", ratings.cleanRating);
      formData.append("friendlyRating", ratings.friendlyRating);
      formData.append("content", reviewText);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(`/api/review/${storeId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("리뷰가 등록되었습니다.");
        setIsWritingReview(false);
        setRatings({ tasteRating: 0, priceRating: 0, cleanRating: 0, friendlyRating: 0 });
        setReviewText("");
        setPreviewImage("/img/default-image.png");
        setImageFile(null); // 파일 초기화

        if (onReviewSubmitted) {
          onReviewSubmitted(); // 부모 컴포넌트에 알림
        }
      } else {
        throw new Error(`Failed to update review: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("Error updating review");
    }

  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setImageFile(file);

    // base64 미리보기 URL 생성
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
                voteAverage={ratings.tasteRating}
                onRate={(value) => handleRatingChange("tasteRating", value)}
              />
            </div>
          </div>
            <div className="rating-item">
              <p>합리적인 가격이었나요?</p>
              <ReviewStarRating
                voteAverage={ratings.priceRating}
                onRate={(value) => handleRatingChange("priceRating", value)}
              />
            </div>
            <div className="rating-item">
              <p>응대는 만족하셨나요?</p>
              <ReviewStarRating
                voteAverage={ratings.friendlyRating}
                onRate={(value) => handleRatingChange("friendlyRating", value)}
              />
            </div>
            <div className="rating-item">
              <p>위생 상태는 어땠나요?</p>
              <ReviewStarRating
                voteAverage={ratings.cleanRating}
                onRate={(value) => handleRatingChange("cleanRating", value)}
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
              placeholder="리뷰를 작성하세요."
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
