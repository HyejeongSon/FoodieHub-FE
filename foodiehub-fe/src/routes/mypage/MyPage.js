import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStoreLikes, fetchStoreFavorites, fetchUserReviews, fetchRemoveStoreLike, fetchRemoveStoreFavorite, fetchDeleteReview } from "../../store/MyPageStore";
import { useUser } from "../../contexts/UserContext";
import "../../styles/MyPage.css";
import StarRating from "./StarRatingMyReviews";

const MyPage = () => {
    const navigate = useNavigate();
    const { user, setUser, fetchUser } = useUser();
    const [activeTab, setActiveTab] = useState("좋아요");
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
    const [storeLikes, setStoreLikes] = useState([]);
    const [storeFavorites, setStoreFavorites] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    // 좋아요 데이터 가져오기
    useEffect(() => {
        if (activeTab === "좋아요") {
            const fetchLikes = async () => {
                try {
                    const data = await fetchStoreLikes();
                    setStoreLikes(data);
                } catch (err) {
                    console.error("좋아요 데이터를 가져오는 중 오류 발생:", err);
                    setError("좋아요 데이터를 불러오는 중 오류가 발생했습니다.");
                }
            };
            fetchLikes();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "북마크") {
            const fetchFavorites = async () => {
                try {
                    const data = await fetchStoreFavorites();
                    setStoreFavorites(data);
                } catch (err) {
                    console.error("북마크 데이터를 가져오는 중 오류 발생:", err);
                    setError("북마크 데이터를 불러오는 중 오류가 발생했습니다.");
                }
            };
            fetchFavorites();
        }
    }, [activeTab]);

    // 리뷰 데이터 가져오기
    useEffect(() => {
        if (activeTab === "내 리뷰") {
            const fetchReviews = async () => {
                try {
                    const data = await fetchUserReviews();
                    setReviews(data);
                    console.log(reviews);
                } catch (err) {
                    console.error("리뷰 데이터를 가져오는 중 오류 발생:", err);
                    setError("리뷰 데이터를 불러오는 중 오류가 발생했습니다.");
                }
            };
            fetchReviews();
        }
    }, [activeTab]);

    // 삭제 기능
    const handleDelete = (item, type) => {
        setSelectedItem({ ...item, type }); // 삭제하려는 항목 설정 및 타입 저장
        setIsDeleteModalOpen(true); // 삭제 모달 열기
    };

    const confirmDelete = async () => {
        try {
            if (selectedItem.type === "like") {
                const response = await fetchRemoveStoreLike(selectedItem.id);
                if (response) {
                    setStoreLikes((prev) => prev.filter((store) => store.id !== selectedItem.id));
                }
            } else if (selectedItem.type === "favorite") {
                const response = await fetchRemoveStoreFavorite(selectedItem.id);
                if (response) {
                    setStoreFavorites((prev) => prev.filter((store) => store.id !== selectedItem.id));
                }
            } else if (selectedItem.type === "review") {
                const response = await fetchDeleteReview(selectedItem.id);
                if (response) {
                    setReviews((prev) => prev.filter((review) => review.id !== selectedItem.id));
                }
            }
            setIsDeleteModalOpen(false); // 삭제 모달 닫기
            setSelectedItem(null); // 초기화
        } catch (err) {
            console.error("삭제 중 오류 발생:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // 삭제 모달 닫기
        setSelectedItem(null); // 초기화
    };

    // 삭제 모달
    const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
        if (!isOpen) return null;
    
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>정말로 삭제하시겠습니까?</p>
                    <div className="modal-buttons">
                        <button onClick={onConfirm}>확인</button>
                        <button onClick={onCancel}>취소</button>
                    </div>
                </div>
            </div>
        );
    };

    const handleDetailStoreButtonClick = (storeId) => {
        navigate(`/store/detail/${storeId}`); // 해당 태그의 리스트 페이지로 이동
    };

    // 탭 렌더링 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "좋아요":
                return (
                    <div className="like-container">
                        {error && <p className="error-message">{error}</p>}
                        {storeLikes.length > 0 ? (
                            storeLikes.map((store) => (
                                <div class="image-container" key={store.id}>
                                    <p 
                                        className="restaurant-name" 
                                        onClick={() => handleDetailStoreButtonClick(store.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {store.name} | <span style={{ fontSize: "12px", color: "#888" }}>{store.category}</span>
                                    </p>
                                    <div className="likelistbox-container">
                                        <div className="likelistbox">
                                            {store.image ? (
                                                <img
                                                    src={`/api/store/image/${store.image}`}
                                                    alt={store.name}
                                                    className="image-placeholder"
                                                />
                                            ) : (
                                                <div className="image-placeholder">이미지 없음</div>
                                            )}
                                            <div className="content-section">
                                                <p>
                                                    {store.intro}<br/>
                                                    {store.content}
                                                </p>
                                                <button className="delete-icon" onClick={() => handleDelete(store, "like")}>
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "16px" }}>좋아요한 가게가 없습니다.</p>
                        )}
                    </div>
                );
            case "북마크":
                return (
                    <div className="like-container">
                        {error && <p className="error-message">{error}</p>}
                        {storeFavorites.length > 0 ? (
                            storeFavorites.map((store) => (
                                <div key={store.id} className="image-container">
                                    <p 
                                        className="restaurant-name" 
                                        onClick={() => handleDetailStoreButtonClick(store.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {store.name} | <span style={{ fontSize: "12px", color: "#888" }}>{store.category}</span>
                                    </p>
                                    <div className="likelistbox-container">
                                        <div className="likelistbox">
                                            {store.image ? (
                                                <img
                                                    src={`/api/store/image/${store.image}`}
                                                    alt={store.name}
                                                    className="image-placeholder"
                                                />
                                            ) : (
                                                <div className="image-placeholder">이미지 없음</div>
                                            )}
                                            <div className="content-section">
                                                <p>
                                                    {store.intro}<br/>
                                                    {store.content}
                                                </p>
                                                <button className="delete-icon" onClick={() => handleDelete(store, "favorite")}>
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "16px" }}>북마크한 가게가 없습니다.</p>
                        )}
                    </div>
                );
            case "내 리뷰":
                return (
                    <div className="review-container">
                        {error && <p className="error-message">{error}</p>}
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <div className="review-info">
                                            {review.createDate ? review.createDate.split("T")[0] : ""}
                                            <div className="review-title">{review.storeName}</div>
                                        </div>
                                        <div className="review-rating">
                                            <span className="rating-text">내 점수: {review.avgRating} / 5</span>
                                            <StarRating voteAverage={review.avgRating} uniqueId={review.id}/>
                                        </div>
                                    </div>
                                    <div className="review-content">{review.content}</div>
                                    <div className="review-actions">
                                        <button className="edit-button" onClick={() => navigate(`/mypage/ReviewEdit/${review.id}`)}>
                                            수정
                                        </button>
                                        <button className="delete-button" onClick={() => handleDelete(review, "review")}>
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "16px" }}>등록된 리뷰가 없습니다.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="container-form">
            <h2>마이페이지</h2>
            <hr className="divider" />
            <div className="parent-container">
                <div className="user-info-container">
                    {/* <div className="user-image"> */}
                    <div>
                        <img
                            src={user.profileimageurl || "/img/default-profile.png"}
                            alt="프로필 사진 미리보기"
                            style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                    <div className="user-details">
                        <p className="nickname"> <b>{user.nickname}</b></p>
                    </div>
                    <button
                        className="updatebutton"
                        type="button"
                        onClick={() => navigate("/mypage/edit")}
                    >
                        회원정보수정
                    </button>
                </div>
            </div>
        
            <div className="tab-container">
                <button
                    className={`tab-button ${activeTab === "좋아요" ? "active" : ""}`}
                    onClick={() => handleTabClick("좋아요")}
                >
                    좋아요
                </button>
                <button
                    className={`tab-button ${activeTab === "북마크" ? "active" : ""}`}
                    onClick={() => handleTabClick("북마크")}
                >
                    북마크
                </button>
                <button
                    className={`tab-button ${activeTab === "내 리뷰" ? "active" : ""}`}
                    onClick={() => handleTabClick("내 리뷰")}
                >
                    내 리뷰
                </button>
            </div>
        
            <div className="tab-content">{renderTabContent()}</div>
            
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
        
    );
};

export default MyPage;
