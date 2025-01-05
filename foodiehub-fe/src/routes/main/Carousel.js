import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/CardList.css"; // CSS 파일 경로
import axios from "axios";
import StarRating from "../mypage/StarRating";

const TagListPage = () => {
  const { tag } = useParams(); // URL에서 태그를 가져옵니다.
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 선택된 태그에 해당하는 데이터 가져오기
    const fetchRestaurantsByTag = async () => {
      try {
        const apiEndpoint =
          tag === "전체" ? `/api/store/all` : `/api/store/tag/${tag}`;
        const response = await axios.get(apiEndpoint);
        setRestaurants(response?.data || []);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurantsByTag();
  }, [tag]);

  const handleDetailStoreButtonClick = (id) => {
    navigate(`/storedetail/${id}`);
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="list-page-container">
      {/* 선택된 태그 출력 */}
      <div className="selected-tag">#{tag}</div>

      {/* 음식점 리스트 */}
      <div className="restaurant-list">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="card">
            <img
              src={
                restaurant.image
                  ? `/api/store/image/${restaurant.image}`
                  : "/img/placeholder.png"
              }
              alt={restaurant.name || "이미지 준비 중"}
              className="card-image"
            />
            <div className="card-header">
              <div className="card-title-rating">
                <h3 className="card-title">{restaurant.name}</h3>
                <div className="card-rating">
                  <StarRating id={restaurant.id} num={restaurant.avgRating} />{" "}
                  {restaurant.avgRating} / 5
                </div>
              </div>
              <p className="card-intro">{restaurant.intro}</p>
            </div>
            <p className="card-description">
              {truncateText(restaurant.content, 50)}
            </p>
            <button
              className="card-button"
              onClick={() => handleDetailStoreButtonClick(restaurant.id)}
            >
              상세 보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagListPage;
