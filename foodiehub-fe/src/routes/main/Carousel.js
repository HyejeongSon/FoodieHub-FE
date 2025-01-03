import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/Carousel.css";
import { useNavigate } from "react-router-dom";
import StarRating from "../mypage/StarRating";

const CustomPrevArrow = ({ onClick }) => (
  <button className="custom-arrow prev" onClick={onClick}>
    ❮
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="custom-arrow next" onClick={onClick}>
    ❯
  </button>
);

const Carousel = ({ items }) => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState(["전체"]); // 기본 선택값 '전체'
  const [visibleCarousels, setVisibleCarousels] = useState([
    { tag: "전체", items }, // 기본값으로 '전체' 데이터 표시
  ]);

  const tags = [
    "전체",
    "중식",
    "일식",
    "이태리",
    "프렌치",
    "아시안",
    "멕시칸",
    "기타",
    "혼밥",
    "모임",
    "회식",
    "데이트",
    "감성",
    "노포",
    "부모님",
  ];

  const handleTagClick = (tag) => {
    if (tag === "전체") {
      // '전체' 클릭 시 모든 태그 초기화
      setSelectedTags(["전체"]);
      setVisibleCarousels([{ tag: "전체", items }]);
    } else {
      const alreadySelected = selectedTags.includes(tag);
      const updatedTags = alreadySelected
        ? selectedTags.filter((t) => t !== tag) // 이미 선택된 태그를 제거
        : [...selectedTags.filter((t) => t !== "전체"), tag]; // '전체' 제거 후 추가

      setSelectedTags(updatedTags);

      if (!alreadySelected) {
        const filteredItems = items.filter((item) => item.tag === tag);
        setVisibleCarousels((prev) => [
          ...prev,
          { tag, items: filteredItems },
        ]);
      } else {
        setVisibleCarousels((prev) =>
          prev.filter((carousel) => carousel.tag !== tag)
        );
      }
    }
  };

  const handleDetailButtonClick = (tag) => {
    navigate(`/list/${tag}`); // 해당 태그의 리스트 페이지로 이동
  };

  const handleDetailStoreButtonClick = (tag) => {
    navigate(`/storedetail`); // 해당 태그의 리스트 페이지로 이동
  };


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div>
      {/* 태그 버튼 컨테이너 */}
      <div className="tag-buttons">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`tag-button ${selectedTags.includes(tag) ? "active" : ""}`}
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* 동적으로 추가된 캐러셀 */}
      <div className="carousel-section">
        {visibleCarousels.map((carousel, index) => (
          <div key={index} className="carousel-container">
            <div className="tag-detail">
              <h3 className="tag-btn">#{carousel.tag}</h3>
              <button
                className="detail-btn"
                onClick={() => handleDetailButtonClick(carousel.tag)}
              >
                자세히보기
              </button>
            </div>
            <Slider {...settings}>
              {carousel.items.map((item, idx) => (
                <div key={idx} className="card">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="card-image"
                  />
                  <div className="card-header">
                    <div className="card-title-rating">
                      <h3 className="card-title">{item.title}</h3>
                      <div className="card-rating"><StarRating key={item.title || idx} id={item.title || idx} num={item.rating}/> {item.rating} / 5</div>
                    </div>
                    <p className="card-intro">{item.intro}</p>
                  </div>
                  <p className="card-description">
                    {truncateText(item.description, 50)}
                  </p>
                  <button 
                  className="card-button"
                  onClick={() => handleDetailStoreButtonClick()}
                  >상세 보기</button>
                </div>
              ))}
            </Slider>
          </div>
        ))}
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default Carousel;
