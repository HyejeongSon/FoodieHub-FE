import React, { useState } from "react";
import "../../styles/ReviewList.css";
import { useUser } from "../../contexts/UserContext";
import { toggleReviewLike } from "../../store/StoreDetailStore";

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return;
  }

  return (
    <div className="reviews-container">
      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const { user } = useUser();
  const isLoggedIn = !!user.nickname; // 로그인 여부 확인
  const [reviewLikes, setReviewLikes] = useState(review.likes); // 좋아요 개수
  const [isReviewLiked, setIsReviewLiked] = useState(review.liked); // 좋아요 여부
  console.log(review);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  const handleReviewLikeToggle = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
        const response = await toggleReviewLike(review.id);
        setReviewLikes(response.likeCount); // 좋아요 개수 업데이트
        setIsReviewLiked(response.liked); // 좋아요 여부 업데이트
    } catch (error) {
        console.error("좋아요 토글 실패:", error);
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="profile-section">
          <img
            src={review.profileImage || "/img/default-profile.png"}
            alt="프로필"
            className="profile-image"
          />
          <div className="profile-info">
            <p className="review-name">{review.nickname}</p>
            <p className="review-date">{review.createDate ? review.createDate.split("T")[0] : ""}</p>
          </div>
        </div>
        <div className="allrating-section" onClick={toggleDetails}>
          <div className="overall-rating">⭐ {review.rating} {review.avgRating} / 5</div>
          {isDetailsVisible && (
            <div className="detailed-rating">
              <p> 맛: ⭐ {review.tasteRating} </p>
              <p> 가격: ⭐ {review.priceRating} </p>
              <p> 위생: ⭐ {review.cleanRating} </p>
              <p> 서비스: ⭐ {review.friendlyRating} </p>
            </div>
          )}
        </div>
      </div>
      <div className="review-content-section">
        <div className="review-content-box">
          {review.content}
        </div>
        {review.reviewImage && (
          <img
            src={`/api/review/image/${review.reviewImage}`}
            alt="리뷰 이미지"
            className="review-image"
          />
        )}
      </div>
      <div className="review-footer">
        <div className="like-section" onClick={handleReviewLikeToggle} style={{ cursor: "pointer" }}>
          <img src={isReviewLiked ? "/img/like.png" : "/img/unlike.png"} alt="좋아요" className="like-icon" />
          <span className="like-count"> 좋아요 {reviewLikes}개</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
