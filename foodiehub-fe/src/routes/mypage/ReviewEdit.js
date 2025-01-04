import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/ReviewEdit.css";
import { downloadReviewImage } from "../../store/MyPageStore";

const StarRating = ({ voteAverage = 0, onRate }) => {
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

const ReviewEdit = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState({
    tasteRating: 0,
    priceRating: 0,
    cleanRating: 0,
    friendlyRating: 0,
    content: "",
  });
  const [reviewImage, setReviewImage] = useState(null); // 서버 전송용 File 객체
  const [previewImage, setPreviewImage] = useState("/img/default-image.png"); // 초기 미리보기 URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewDetails = async () => {
      console.log("Fetching review details for ID:", reviewId); // 디버깅
      try {
        const response = await fetch(`/api/review/${reviewId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched review data:", data); // 디버깅
          setReview(data);

          if (data.reviewImage) {
            try {
              const imageBlob = await downloadReviewImage(data.reviewImage);
              const imageURL = URL.createObjectURL(imageBlob);
              setPreviewImage(imageURL);
              setReviewImage(data.reviewImage); // 서버 전송용 상태 유지
            } catch (imageError) {
              console.error("이미지 다운로드 실패:", imageError);
              setPreviewImage("/img/default-image.png");
              setReviewImage(null);
            }
          } else {
            setPreviewImage("/img/default-image.png");
            setReviewImage(null);
          }
        } else {
          throw new Error("Failed to fetch review data");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching review data");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetails();
  }, [reviewId]);

  const handleRatingChange = (key, value) => {
    console.log(`Rating changed: ${key} -> ${value}`); // 디버깅
    setReview((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleContentChange = (e) => {
    const newValue = e.target.value;
    console.log("Content updated:", newValue); // 디버깅
    setReview((prev) => ({
      ...prev,
      content: newValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 형식 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    console.log("Image selected:", file); // 디버깅
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    const newImageURL = URL.createObjectURL(file);
    setPreviewImage(newImageURL);
    setReviewImage(file);

    e.target.value = ""; // input 초기화 (다시 같은 파일을 선택해도 변경 감지 가능)
  };

  const handleDeleteImage = () => {
    console.log("Deleting image"); // 디버깅
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage("/img/default-image.png"); // 미리보기 URL을 기본 이미지로 초기화
    setReviewImage(null); // 서버 전송용 상태를 초기화
  };

  const handleSubmit = async () => {
    console.log("Submitting form with review data:", review); // 디버깅
    try {
      const formData = new FormData();

      formData.append("tasteRating", review.tasteRating);
      formData.append("priceRating", review.priceRating);
      formData.append("cleanRating", review.cleanRating);
      formData.append("friendlyRating", review.friendlyRating);
      formData.append("content", review.content);

      if (!reviewImage) {
        formData.append("deleteImage", "true");
      } else if (reviewImage instanceof File) {
        formData.append("image", reviewImage);
      }

      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`FormData entry -> ${key}:`, value.name); // 파일 이름 출력
        } else {
          console.log(`FormData entry -> ${key}:`, value);
        }
      }

      const response = await fetch(`/api/review/${reviewId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Review updated successfully!");
        navigate("/mypage");
      } else {
        throw new Error(`Failed to update review: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("Error updating review");
    }
  };

  const handleCancel = () => {
    console.log("Cancel button clicked"); // 디버깅
    navigate("/mypage");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const ratingKeys = [
    { key: "tasteRating", label: "음식이 맛있었나요?" },
    { key: "priceRating", label: "합리적인 가격이었나요?" },
    { key: "friendlyRating", label: "응대는 만족하셨나요?" },
    { key: "cleanRating", label: "위생 상태는 어땠나요?" },
  ];

  return (
    <div className="review-edit-container">
      <h2>리뷰 수정</h2>
      <div className="review-edit-form">
        <h3>이 가게를 평가해 주세요</h3>
        <div className="Modify-rating-section">
          {ratingKeys.map(({ key, label }) => (
            <div key={key} className="rating-item">
              <span>{label}</span>
              <StarRating
                voteAverage={review[key]}
                onRate={(value) => handleRatingChange(key, value)}
              />
            </div>
          ))}
        </div>
        <div className="comment-image-container">
          <div className="image-section">
            <label htmlFor="image-upload" className="image-upload-label">
              <img
                src={previewImage}
                alt="리뷰 이미지 미리보기"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </label>
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
          </div>

          <div className="comment-section">
            <textarea
              id="content"
              value={review.content || ""}
              onChange={handleContentChange}
              placeholder="리뷰를 입력해주세요."
            />
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button className="submit-button" onClick={handleSubmit}>
          수정
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          취소
        </button>
      </div>
    </div>
  );
};

export default ReviewEdit;
