import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/StoreDetail.css";
import StarRating from "../mypage/StarRating";
import AllMenu from "../../routes/storedetail/AllMenu";
import Review from "../../routes/storedetail/Review";
import ReviewList from "../../routes/storedetail/ReviewList";
import MapComponent from "../../components/MapComponent";



const StoreDetail = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };
  const spanRef = useRef(null);

  const handleClick = () => {
    alert(spanRef.current.innerText);
  }
  // 리뷰리스트 가데이터
  const review = [
    {
      profileImage: "/img/profile1.png",
      name: "닉네임1",
      date: "2024-01-01",
      rating: 4.5,
      details: {
        taste: 4.7,
        price: 4.5,
        hygiene: 4.8,
        service: 4.6,
      },
      content: "리뷰 내용 1 리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1",
      likes: 3,
      image: "/img/review1.png",
    },
    {
      profileImage: "/img/profile2.png",
      name: "닉네임2",
      date: "2024-01-02",
      rating: 4.0,
      details: {
        taste: 4.0,
        price: 4.2,
        hygiene: 4.1,
        service: 4.3,
      },
      content: "리뷰 내용 2",
      likes: 5,
      image: "/img/review2.png",
    },
    {
      profileImage: "/img/profile1.png",
      name: "닉네임3",
      date: "2024-01-03",
      rating: 4.5,
      details: {
        taste: 4.7,
        price: 4.5,
        hygiene: 4.8,
        service: 4.6,
      },
      content: "리뷰 내용 3",
      likes: 3,
      image: "/img/review1.png",
    },
    {
      profileImage: "/img/profile2.png",
      name: "닉네임4",
      date: "2024-01-04",
      rating: 4.0,
      details: {
        taste: 4.0,
        price: 4.2,
        hygiene: 4.1,
        service: 4.3,
      },
      content: "리뷰 내용 4",
      likes: 5,
      image: "/img/review2.png",
    },
  ];


  return (
    <div className="detail-container">
    <div className="store-detail">
      {/* Header Section */}
      <div className="carousel-section">
        <Slider {...settings}>
          <img src="/img/img_3.jpg" alt="이미지1" />
          <img src="/img/img_3.jpg" alt="이미지2" />
          <img src="/img/img2.jpg" alt="이미지3" />
        </Slider>
      </div>

     {/* Info Section */}
     <div className="info-section">
          {/* 왼쪽 정보 */}
          <div className="info-left">
            <div className="info-header">
              <h1 className="store-name">파블라</h1>
              <div className="rating-section">
                <div className="star-rating"><StarRating /></div>
                <span className="rating-text">4.1 / 5</span>
              </div>
            </div>
            <div className="info-intro">간짜장과 짬뽕이 맛있는 식당입니다.</div>
            <div className="info-details">
              <p>
                <strong>분류</strong>
                <span>중식</span>
              </p>
              <p>
                <strong>주소</strong>
                <span ref={spanRef}>서울시 강남구 강남대로 37</span>
              </p>
            </div>
            <div className="additional-info">
              <div className="info-item">
                <strong>전화번호</strong>
                <span>02-987-1234</span>
              </div>
              <div className="info-item">
                <strong>주차 가능 여부</strong>
                <span>불가</span>
              </div>
              <div className="info-item">
                <strong>영업시간</strong>
                <span>12:00 ~ 23:00</span>
              </div>
              <div className="info-item">
                <strong>라스트오더</strong>
                <span>21:00</span>
              </div>
              <button className="info-tag-button">#태그</button>
            </div>
          </div>

          {/* 오른쪽 지도 */}
          <div className="info-right">
            <div className="map-section">
              <div className="map-placeholder">
                <MapComponent address={"강남대로 374"} name={"파불라"}/>
              </div>
            </div>
            <button className="navigate-button" onClick={handleClick}>길찾기</button>
          </div>
        </div>


      {/* Description Section */}
      <div className="description-section">
        <div className="intro-section">
          <h2 className="store-intro">매장소개</h2>
          <p>
            다양한 요리를 즐길 수 있는 매장입니다... 다양한 요리를 즐길 수 있는
            매장입니다...다양한 요리를 즐길 수 있는 매장입니다... 다양한 요리를 즐길 수 있는
            매장입니다...다양한 요리를 즐길 수 있는 매장입니다... 다양한 요리를 즐길 수 있는
            매장입니다...다양한 요리를 즐길 수 있는 매장입니다... 다양한 요리를 즐길 수 있는
            매장입니다...
          </p>
        </div>
        <h3>메뉴</h3>
        <AllMenu />
      </div>

     {/* Reviews Section */}
     <div className="reviews-section">
          <Review />
          <ReviewList reviews={review} />
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;