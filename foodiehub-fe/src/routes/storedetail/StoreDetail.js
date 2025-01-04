import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/StoreDetail.css";
import StarRating from "../mypage/StarRating";
import MenuList from "../../routes/storedetail/AllMenu";
import Review from "../../routes/storedetail/Review";
import ReviewList from "../../routes/storedetail/ReviewList";
import MapComponent from "../../components/MapComponent";
import { useUser } from "../../contexts/UserContext";
import { fetchStoreDetail, toggleStoreLike, toggleStoreFavorite } from "../../store/StoreDetailStore";

const StoreDetail = () => {
  const { storeId } = useParams();
  const { user } = useUser();
  const isLoggedIn = !!user.nickname; // 로그인 여부 확인
  const [storeDetail, setStoreDetail] = useState(null); // 스토어 상세 정보 상태
  const [likes, setLikes] = useState(0); // 좋아요 개수
  const [isLiked, setIsLiked] = useState(false); // 좋아요 여부
  const [favorites, setFavorites] = useState(0); // 북마크 개수
  const [isFavorite, setIsFavorite] = useState(false); // 북마크 여부
  const [error, setError] = useState(null); // 에러 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const getStoreDetail = async () => {
        try {
            setLoading(true); // 로딩 시작
            const data = await fetchStoreDetail(storeId); // API 호출
            setStoreDetail(data); // 데이터 저장
            setLikes(data.likes); // 좋아요 개수 저장
            setIsLiked(data.isLiked); // 좋아요 여부 저장
            setFavorites(data.favorites); // 북마크 개수 저장
            setIsFavorite(data.isFavorite); // 북마크 여부 저장
        } catch (err) {
            setError(err.response?.message || "스토어 정보를 가져오는 중 오류가 발생했습니다."); // 에러 처리
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    if (storeId) {
        getStoreDetail();
    } else {
        setError("유효한 스토어 ID가 제공되지 않았습니다.");
        setLoading(false);
    }
}, [storeId]);

const getSettings = (images) => ({
  dots: false,
  infinite: images.length >= 3,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: images.length >= 3,
  autoplaySpeed: 2500,
});

// 좋아요 토글 핸들러
const handleLikeToggle = async () => {
  if (!isLoggedIn) {
    alert("로그인이 필요합니다.");
    return;
  }
  try {
      const response = await toggleStoreLike(storeId);
      setLikes(response.likeCount); // 좋아요 개수 업데이트
      setIsLiked(response.liked); // 좋아요 여부 업데이트
  } catch (error) {
      console.error("좋아요 토글 실패:", error);
  }
};

// 북마크 토글 핸들러
const handleFavoriteToggle = async () => {
  if (!isLoggedIn) {
    alert("로그인이 필요합니다.");
    return;
  }
  try {
      const response = await toggleStoreFavorite(storeId);
      setFavorites(response.favoriteCount); // 북마크 개수 업데이트
      setIsFavorite(response.favorited); // 북마크 여부 업데이트
  } catch (error) {
      console.error("북마크 토글 실패:", error);
  }
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
    {storeDetail ? (
    <div className="store-detail">
      {/* Header Section */}
      <div className="carousel-section">
        {storeDetail?.images && storeDetail.images.length > 0 && (
          <Slider {...getSettings(storeDetail.images)}>
            {storeDetail.images.map((img, index) => (
              <img key={index} src={`/api/store/image/${img}`} alt={`이미지 ${index}`} />
            ))}
          </Slider>
        )}
      </div>

     {/* Info Section */}
     <div className="info-section">
          {/* 왼쪽 정보 */}
          <div className="info-left">
            <div className="info-header">
              <h1 className="store-name">{storeDetail.name}</h1>
              <div className="rating-section">
                <div className="star-rating"><StarRating key={storeDetail.id} id={storeDetail.id} num={storeDetail.avgRating}/></div>
                <span className="rating-text">{storeDetail.avgRating} / 5</span>

                {/* 좋아요 섹션 */}
                <div className="like-section" onClick={handleLikeToggle} style={{ cursor: "pointer" }}>
                  <img src={isLiked ? "/img/like.png" : "/img/unlike.png"} alt="좋아요" className="icon" />
                  <span className="like-count">{likes}</span>
                </div>

                {/* 북마크 섹션 */}
                <div className="bookmark-section" onClick={handleFavoriteToggle} style={{ cursor: "pointer" }}>
                  <img src={isFavorite ? "/img/favorite.png" : "/img/unfavorite.png"} alt="북마크" className="icon" />
                  <span className="bookmark-count">{favorites}</span>
                </div>
              </div>
            </div>
            <div className="info-intro">{storeDetail.intro}</div>
            <div className="info-details">
              <p>
                <strong>분류</strong>
                <span>{storeDetail.category}</span>
              </p>
              <p>
                <strong>주소</strong>
                <span ref={spanRef}>{storeDetail.address}</span>
              </p>
            </div>
            <div className="additional-info">
              <div className="info-item">
                <strong>전화번호</strong>
                <span>{storeDetail.phone}</span>
              </div>
              <div className="info-item">
                <strong>주차 가능 여부</strong>
                <span>{storeDetail.parking === 1 ? "가능" : "불가"}</span>
              </div>
              <div className="info-item">
                <strong>영업시간</strong>
                <span>{storeDetail.operationHours || "정보 없음"}</span>
              </div>
              <div className="info-item">
                <strong>라스트오더</strong>
                <span>{storeDetail.lastOrder || "정보 없음"}</span>
              </div>
            </div>
            {storeDetail.tags && storeDetail.tags.length > 0 && (
                <>
                <strong>태그</strong>
                <div className="tag-container">
                  {storeDetail.tags.map((tag, index) => (
                    <button key={index} className="info-tag-button">
                      #{tag}
                    </button>
                  ))}
                </div>
                </>
              )}
          </div>

          {/* 오른쪽 지도 */}
          <div className="info-right">
            <div className="map-section">
              <div className="map-placeholder">
                <MapComponent address={storeDetail.address} name={storeDetail.name}/>
              </div>
            </div>
            <button className="navigate-button" onClick={handleClick}>길찾기</button>
          </div>
        </div>

      {/* Description Section */}
      <div className="description-section">
        <div className="intro-section">
          <h2 className="store-intro">{storeDetail.intro}</h2>
          <p>
            {storeDetail.content}
          </p>
        </div>
        <h3>메뉴</h3>
        {storeDetail?.menus && storeDetail.menus.length > 0 ? (
          <MenuList menus={storeDetail.menus} />
        ) : (
          <p><br></br>메뉴 정보가 없습니다.</p>
        )}
      </div>

     {/* Reviews Section */}
     <div className="reviews-section">
          <Review />
          <ReviewList reviews={review} />
        </div>
      </div>
      ) : loading ? (
        <p>로딩 중...</p>
      ) : (
        <p className="error-message">{error || "스토어 정보를 불러올 수 없습니다."}</p>
      )}
    </div>
  );
};

export default StoreDetail;