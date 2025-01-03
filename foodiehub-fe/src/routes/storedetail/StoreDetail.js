import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/StoreDetail.css";
import StarRating from "../mypage/StarRating";

const StoreDetail = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const storeInfo = {
    name: "파불라",
    intro: "다채로운 풍미가 어우러진 사천 요리",
    category: "중식",
    address: "서울시 강남구 강남대로 37",
    phone: "02-987-1234",
    parking: "불가",
    openHours: "12:00 ~ 23:00",
    rating: 3.4,
  };

  const reviews = [
    { name: "닉네임1", date: "2023-12-31", rating: 4.5, likes: 3 },
    { name: "닉네임2", date: "2023-12-30", rating: 5, likes: 2 },
    { name: "닉네임3", date: "2023-12-29", rating: 3.5, likes: 4 },
  ];

  return (
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
        <div className="info-left">
          <h1>{storeInfo.name}</h1>
          <div className="rating-section">
            <StarRating num={storeInfo.rating} /> / 5
          </div>
          <p className="intro">{storeInfo.intro}</p>
        </div>
        <div className="info-details">
          <p>분류: {storeInfo.category}</p>
          <p>주소: {storeInfo.address}</p>
          <p>전화번호: {storeInfo.phone}</p>
          <p>주차 가능 여부: {storeInfo.parking}</p>
          <p>영업시간: {storeInfo.openHours}</p>
          <div className="map-section">
            <button>길찾기</button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="description-section">
        <h2>매장소개</h2>
        <p>다양한 요리를 즐길 수 있는 매장입니다...</p>
        <h3>메뉴</h3>
        <table>
          <thead>
            <tr>
              <th>메뉴</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>볶음밥</td>
              <td>₩10,000</td>
            </tr>
            <tr>
              <td>짜장면</td>
              <td>₩8,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>푸디허브 리뷰</h2>
        {reviews.map((review, index) => (
          <div key={index} className="review">
            <p>작성자: {review.name}</p>
            <p>날짜: {review.date}</p>
            <p>별점: ⭐ {review.rating}</p>
            <p>좋아요: {review.likes}개</p>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="footer-section">
        <button>리뷰 더 보기</button>
      </div>
    </div>
  );
};

export default StoreDetail;