import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/StoreDetail.css";
import StarRating from "../mypage/StarRating";
import AllMenu from "../../routes/storedetail/AllMenu";
import Review from "../../routes/storedetail/Review";

const StoreDetail = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const reviews = [
    { name: "닉네임1", date: "2023-12-31", rating: 4.5, likes: 3 },
    { name: "닉네임2", date: "2023-12-30", rating: 5, likes: 2 },
    { name: "닉네임3", date: "2023-12-29", rating: 3.5, likes: 4 },
  ];

  return (
    <div className="detail-container">
    <div className="store-detail">
      {/* Header Section */}
      <div className="carousel-section">
        <Slider {...settings}>
          <img src="/img/img_3.jpg" alt="이미지1" />
          <img src="/img/img_3.jpg" alt="이미지2" />
          <img src="/img/img_3.jpg" alt="이미지3" />
        </Slider>
      </div>

      {/* Info Section */}
      <div className="info-section">
        {/* 음식점 이름과 별점 */}
        <div class="info-header">
          <h1 class="store-name">음식점 이름</h1>
            <div class="rating-section">
              <StarRating num={4.1} /> 
            <span className="rating-text">4.1 / 5</span>
          </div>
        </div>

        {/* 분류와 주소 */}
        <div className="info-details">
          <p>분류: 중식</p>
          <p>주소: 서울시 강남구 강남대로 37</p>
        </div>

        {/* 기타 정보 */}
        <div className="additional-info">
          <p>전화번호: 02-987-1234</p>
          <p>주차 가능 여부: 불가</p>
          <p>영업시간: 12:00 ~ 23:00</p>
        </div>
        
        {/* 지도 API가 들어갈 영역 */}
        <div className="map-section">     
          <div id="map" className="map"></div>
        </div>
        <div className="map-section">
          <button>길찾기</button>
        </div>
      </div>

      {/* Description Section */}
      <div className="description-section">
        <div className="intro-section">
          <h2 className="store-intro">매장소개</h2>
          <p>다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...다양한 요리를 즐길 수 있는 매장입니다...</p>
        </div>
        <h3>메뉴</h3>
          <AllMenu />
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <Review />
      </div>
      {/* Footer Section */}
      <div className="footer-section">
      </div>
    </div>
    </div>
  );
};

export default StoreDetail;
