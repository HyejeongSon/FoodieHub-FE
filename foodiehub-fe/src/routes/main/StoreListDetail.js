import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/StoreListDetail.css";
import axios from "axios";
import StarRating from "../mypage/StarRating";
import CategoryEnum from "./CategoryEnum";

const StoreListDetail = () => {
  const { type, tag } = useParams(); // URL에서 type과 tag 가져오기
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantsByTypeAndTag = async () => {
      try {
        let apiEndpoint = "/api/store/all"; // 기본값: 전체 데이터
        if (type === "category") {
          apiEndpoint = `/api/store/category/${tag}`;
        } else if (type === "tag") {
          apiEndpoint = `/api/store/tag/${tag}`;
        }
  
        const response = await axios.get(apiEndpoint);
        setRestaurants(response?.data || []);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
  
    fetchRestaurantsByTypeAndTag();
  }, [type, tag]);

  const getDisplayTag = (type, tag) => {
    if (type === "category") {
      return CategoryEnum[tag] || tag; // CategoryEnum에 없는 경우 기본값으로 tag 반환
    }
    return tag; // 다른 타입은 그대로 반환
  };

  const handleDetailButtonClick = (storeId) => {
    navigate(`/store/detail/${storeId}`); // 음식점 상세 페이지로 이동
  };

  const truncateText = (text, limit) => {
    if (!text) return ""; // null 또는 undefined를 방지
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="list-page-container">
      {/* 왼쪽 상단 선택된 태그 표시 */}
      <div className="selected-tag">
        #{getDisplayTag(type, tag)}
      </div>

      {/* 음식점 리스트 */}
      <div className="restaurant-list">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <img
              src={
                restaurant.image
                  ? `/api/store/image/${restaurant.image}`
                  : "/img/placeholder.png"
              }
              alt={restaurant.name || "이미지 준비 중"}
              className="restaurant-image"
            />
            <div className="restaurant-header">
              <h3 className="restaurant-name">{restaurant.name}</h3>
              <div className="restaurant-rating">
                <StarRating id={restaurant.id} num={restaurant.avgRating} /> {restaurant.avgRating} / 5
              </div>
            </div>
            <p className="restaurant-description">
              {truncateText(restaurant.intro, 50)} {/* 50자는 예시 */}
            </p>
            <button
              className="restaurant-detail-button"
              onClick={() => handleDetailButtonClick(restaurant.id)}
            >
              상세 보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreListDetail;
