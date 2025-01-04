import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/Carousel.css";
import { useNavigate } from "react-router-dom";
import CategoryEnum from "./CategoryEnum.js";
import axios from "axios";
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

const Carousel = ({ items = [] }) => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState(["전체"]);
  const [visibleCarousels, setVisibleCarousels] = useState([{ tag: "전체", items }]);

  const categoryTags = Object.entries(CategoryEnum).map(([key, value]) => ({
    key,
    display: value,
    type: "category",
  }));

  const generalTags = [
    { key: "혼밥", display: "혼밥", type: "tag" },
    { key: "모임", display: "모임", type: "tag" },
    { key: "회식", display: "회식", type: "tag" },
    { key: "데이트", display: "데이트", type: "tag" },
    { key: "감성", display: "감성", type: "tag" },
    { key: "노포", display: "노포", type: "tag" },
    { key: "부모님", display: "부모님", type: "tag" },
  ];

  const tags = [
    { key: "전체", display: "전체", type: "all" },
    ...categoryTags,
    ...generalTags,
  ];

  const fetchItemsByCategoryOrTag = async (tag) => {
    try {
      const selectedTag = tags.find((t) => t.key === tag);
      if (!selectedTag) return;

      const apiEndpoint = 
        selectedTag.type === "category"
          ? `/api/store/category/${selectedTag.key}`
          : selectedTag.type === "tag"
          ? `/api/store/tag/${selectedTag.key}`
          : `/api/store/all`;

      const response = await axios.get(apiEndpoint, { params: { limit: 5 } });
      const newItems = response?.data || [];

      setVisibleCarousels((prev) => [
        ...prev.filter((carousel) => carousel.tag !== selectedTag.key),
        { tag: selectedTag.key, items: newItems },
      ]);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // 최초 렌더링 시 "전체" 데이터 로드
  useEffect(() => {
    fetchItemsByCategoryOrTag("전체");
  }, []); // 빈 배열로 설정하여 컴포넌트가 처음 렌더링될 때만 실행


  const handleTagClick = (tagKey) => {
    if (tagKey === "전체") {
      setSelectedTags(["전체"]);
      fetchItemsByCategoryOrTag("전체");
    } else {
      const alreadySelected = selectedTags.includes(tagKey);
      const updatedTags = alreadySelected
        ? selectedTags.filter((t) => t !== tagKey)
        : [...selectedTags.filter((t) => t !== "전체"), tagKey];

      setSelectedTags(updatedTags);

      if (!alreadySelected) {
        fetchItemsByCategoryOrTag(tagKey);
      } else {
        setVisibleCarousels((prev) =>
          prev.filter((carousel) => carousel.tag !== tagKey)
        );
      }
    }
  };

  const getSettings = (carouselItems) => ({
    dots: false,
    infinite: carouselItems.length >= 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, carouselItems.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(1, carouselItems.length),
          slidesToScroll: 1,
        },
      },
    ],
  });

  const handleDetailButtonClick = (tag) => {
    navigate(`/list/${tag}`); // 해당 태그의 리스트 페이지로 이동
  };

  const handleDetailStoreButtonClick = (tag) => {
    navigate(`/storedetail`); // 해당 태그의 리스트 페이지로 이동
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const adjustCarouselItems = (carouselItems) => {
    const emptySlots = 3 - carouselItems.length; // 3개에 맞추기 위한 빈 슬롯 계산
    if (emptySlots > 0) {
      return [
        ...carouselItems,
        ...Array(emptySlots).fill({ isPlaceholder: true }), // 빈 객체로 채움
      ];
    }
    return carouselItems;
  };

  return (
    <div>
      <div className="tag-buttons">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`tag-button ${selectedTags.includes(tag.key) ? "active" : ""}`}
            onClick={() => handleTagClick(tag.key)}
          >
            #{tag.display}
          </button>
        ))}
      </div>

      <div className="carousel-section">
        {visibleCarousels.map((carousel, index) => (
          <div key={index} className="carousel-container">
            <div className="tag-detail">
              <h3 className="tag-btn">
                #{tags.find((tag) => tag.key === carousel.tag)?.display || carousel.tag}
              </h3>
              <button
                className="detail-btn"
                onClick={() => handleDetailButtonClick(carousel.tag)}
              >
                자세히보기
              </button>
            </div>
            <Slider key={carousel.tag} {...getSettings(carousel.items)}>
              {adjustCarouselItems(carousel.items).map((item, idx) => (
                <div
                  key={idx}
                  className={item.isPlaceholder ? "card placeholder" : "card"}
                >
                  {!item.isPlaceholder ? (
                    <>
                      <img
                        src={
                          item.image
                            ? `/api/store/image/${item.image}`
                            : "/img/placeholder.png"
                        }
                        alt={item.name || "이미지 준비 중"}
                        className="card-image"
                      />
                      <div className="card-header">
                        <div className="card-title-rating">
                          <h3 className="card-title">{item.name}</h3>
                          <div className="card-rating"><StarRating key={item.id} id={item.id} num={item.avgRating}/> {item.avgRating} / 5</div>
                        </div>
                        <p className="card-intro">{item.intro}</p>
                      </div>
                      <p className="card-description">{truncateText(item.content, 50)}</p>
                      <button
                        className="card-button"
                        onClick={() => handleDetailStoreButtonClick()}
                      >
                        상세 보기
                      </button>
                    </>
                  ) : null}
                </div>
              ))}
            </Slider>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
