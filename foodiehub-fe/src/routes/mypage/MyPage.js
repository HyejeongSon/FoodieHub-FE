import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserReviews, downloadReviewImage } from "../../store/ReviewStore";
import { useUser } from "../../contexts/UserContext";
import "../../styles/MyPage.css";
import StarRating from "./StarRatingMyReviews";

const MyPage = () => {
    const navigate = useNavigate();
    // const { user, setUser } = useUser(); // Context에서 가져오기
    // const [imagePreview,setImagePreview] = useState(user?.profileimageurl ||"/img/default-profile.png"); // 미리보기
    const { user, setUser, fetchUser } = useUser();
    const [activeTab, setActiveTab] = useState("좋아요");
    // 상태 정의
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    // 데이터 가져오기
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
    }, [activeTab]); // '내 리뷰' 탭이 선택되었을 때만 데이터 가져오기

    const handleImageDownload = async (filename) => {
        try {
            const imageBlob = await downloadReviewImage(filename);
            const imageURL = URL.createObjectURL(imageBlob);
            const a = document.createElement("a");
            a.href = imageURL;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(imageURL);
        } catch (err) {
            console.error("이미지 다운로드 실패:", err);
            alert("이미지를 다운로드할 수 없습니다.");
        }
    };

    // 삭제 기능
    const handleDelete = (item) => {
        setSelectedItem(item); // 삭제하려는 항목 설정
        setIsDeleteModalOpen(true); // 삭제 모달 열기
    };

    const confirmDelete = () => {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== selectedItem.id));
        setIsDeleteModalOpen(false); // 삭제 모달 닫기
        setSelectedItem(null); // 초기화
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // 삭제 모달 닫기
        setSelectedItem(null); // 초기화
    };

    // 수정 기능
    const handleEdit = (item) => {
        setSelectedItem(item); // 수정하려는 항목 설정
        setIsEditModalOpen(true); // 수정 모달 열기
    };

    const confirmEdit = () => {
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.id === selectedItem.id ? selectedItem : review
            )
        );
        setIsEditModalOpen(false); // 수정 모달 닫기
        setSelectedItem(null); // 초기화
    };

    const cancelEdit = () => {
        setIsEditModalOpen(false); // 수정 모달 닫기
        setSelectedItem(null); // 초기화
    };

    // 탭 렌더링 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "좋아요":
                return (
                    <div class="image-container">
                    <p class="restaurant-name">음식점 이름</p>
                <div className="likelistbox-container">
                    <div className="likelistbox">
                        <div className="image-placeholder">
                            <i className="icon">📷</i>
                        </div>
                            <div className="content-section">
                                <p>북마크 항목 1</p>
                                <button
                                    className="delete-icon"
                                    onClick={() => handleDelete({ id: "bookmark1", name: "북마크 항목 1" })}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                  );
            case "북마크":
                return (
                    <div class="image-container">
                        <p class="restaurant-name">음식점 이름</p>
                    <div className="likelistbox-container">
                        <div className="likelistbox">
                            <div className="image-placeholder">
                                <i className="icon">📷</i>
                            </div>
                            <div className="content-section">
                                <p>북마크 항목 1</p>
                                <button
                                    className="delete-icon"
                                    onClick={() => handleDelete({ id: "bookmark1", name: "북마크 항목 1" })}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                );
            case "내 리뷰":
                return (
                    <div className="review-container">
                        <h3>내 리뷰</h3>
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
                                    {/* {review.reviewImage && (
                                        <div className="review-image">
                                            <img
                                                src={`/api/review/image/${review.reviewImage}`}
                                                alt="리뷰 이미지"
                                                onClick={() => handleImageDownload(review.reviewImage)}
                                                style={{ cursor: "pointer", maxWidth: "100%", height: "auto" }}
                                            />
                                        </div>
                                    )} */}
                                    <div className="review-actions">
                                        <button className="edit-button" onClick={() => navigate(`/mypage/ReviewEdit/${review.id}`)}>
                                            수정
                                        </button>
                                        <button className="delete-button">삭제</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>등록된 리뷰가 없습니다.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
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

    // 수정 모달
    const EditModal = ({ isOpen, onConfirm, onCancel, selectedItem }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>수정하기</h3>
                    <input
                        type="text"
                        value={selectedItem?.title || ""}
                        onChange={(e) =>
                            setSelectedItem((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                    <textarea
                        value={selectedItem?.content || ""}
                        onChange={(e) =>
                            setSelectedItem((prev) => ({
                                ...prev,
                                content: e.target.value,
                            }))
                        }
                    />
                    <div className="modal-buttons">
                        <button onClick={onConfirm}>확인</button>
                        <button onClick={onCancel}>취소</button>
                    </div>
                </div>
            </div>
        );
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
                            src={user.profileimageurl}
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
            <EditModal
                isOpen={isEditModalOpen}
                onConfirm={confirmEdit}
                onCancel={cancelEdit}
                selectedItem={selectedItem}
            />
        </div>
        
    );
};

export default MyPage;
