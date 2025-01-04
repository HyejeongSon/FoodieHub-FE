import React, { useState } from "react";
import "../../styles/ReviewList.css";

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
  const [likes, setLikes] = useState(review.likes);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
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
            <p className="review-name">{review.name}</p>
            <p className="review-date">{review.date}</p>
          </div>
        </div>
        <div className="allrating-section" onClick={toggleDetails}>
          <div className="overall-rating">⭐ {review.rating} / 5</div>
          {isDetailsVisible && review.details && (
            <div className="detailed-rating">
              <p> 맛: ⭐ {review.details.taste} </p>
              <p> 가격: ⭐ {review.details.price} </p>
              <p> 위생: ⭐ {review.details.hygiene} </p>
              <p> 서비스: ⭐ {review.details.service} </p>
            </div>
          )}
        </div>
      </div>
      <div className="review-content-section">
        <div className="review-content">
          {review.content}
        </div>
        {review.image && (
          <img
            src={review.image || "/img/default-review.png"}
            alt="리뷰 이미지"
            className="review-image"
          />
        )}
      </div>
      <div className="review-footer">
        <p className="review-likes" onClick={handleLike} >❤️ 좋아요 {likes}개</p>
      </div>
    </div>
  );
};

export default ReviewList;
