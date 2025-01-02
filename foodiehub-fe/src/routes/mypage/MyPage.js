// src/pages/MyPage/MyPage.js
import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext"; // Context 추가


const MyPage = () => {
    const navigate = useNavigate();
    // const { user, setUser } = useUser(); // Context에서 가져오기
    // const [imagePreview,setImagePreview] = useState(user?.profileimageurl ||"/img/default-profile.png"); // 미리보기
    const { user, fetchUser } = useUser();

    // 상태 정의
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태

    // 임시 리뷰 데이터
    const [reviews, setReviews] = useState([
        {
            id: 1,
            title: "리뷰 제목 1",
            date: "2024-12-12",
            content: "리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1리뷰 내용 1",
            rating: 4.5,
        },
        {
            id: 2,
            title: "리뷰 제목 2",
            date: "2024-12-13",
            content: "리뷰 내용 2",
            rating: 3.5,
        },
    ]);

    return (
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
            <p>닉네임 <b>{user.nickname}</b></p>
            <button className="button" type="button" onClick={() =>navigate("/mypage/edit")}>회원정보수정</button>
        </div>
    )
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await httpRequest("GET", "/api/auth/me");
                setUser({
                    email: userInfo.email,
                    name: userInfo.name,
                    nickname: userInfo.nickname,
                    provider: userInfo.provider,
                    role: userInfo.role || "ROLE_USER",
                });
            } catch (error) {
                console.error("GET /api/auth/me 실패:", error);
            }
        };

        if (!user.nickname || !user.email) {
            fetchUserData();
        }
    }, [user, setUser]);

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
                    <div className="likelistbox-container">
                        <div className="likelistbox">
                            <div className="image-placeholder">
                                <i className="icon">📷</i>
                            </div>
                            <div className="content-section">
                                <p>좋아요 항목 1</p>
                                <button
                                    className="delete-icon"
                                    onClick={() => handleDelete({ id: "like1", name: "좋아요 항목 1" })}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case "북마크":
                return (
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
                );
            case "내 리뷰":
                return (
                    <div className="review-container">
                        <h3>내 리뷰</h3>
                        {reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <div className="review-info">
                                        <div className="review-date">{review.date}</div>
                                        <div className="review-title">{review.title}</div>
                                    </div>
                                    <div className="review-rating">
                                        <div className="rating-text-container">
                                            <span className="rating-text">내점수</span>
                                            <span className="rating-text">{review.rating} / 5</span>
                                        </div>
                                        <StarRating voteAverage={review.rating} />
                                    </div>
                                </div>
                                <div className="review-content">{review.content}</div>
                                <div className="review-actions">
                                    <button className="edit-button" onClick={() => navigate("/mypage/ReviewEdit")}>수정</button>
                                    <button className="delete-button" onClick={() => handleDelete(review)}>삭제</button>
                                </div>
                            </div>
                        ))}
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
        <div>
            <h2>마이페이지</h2>
            <hr className="divider" />
            <div className="parent-container">
                <div className="user-info-container">
                    <div className="user-image"></div>
                    <div className="user-details">
                        <p className="nickname"> 닉네임 <b>{user.nickname}</b></p>
                        <p className="email">아이디 <b>{user.email}</b></p>
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
