import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/StoreRegister.css";

const StoreRegister = () => {
    const navigate = useNavigate(); // navigate 초기화
  const [menus, setMenus] = useState([{ name: "", price: "" }]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    intro: "",
    phone: "",
    address: "",
    category: "KOREAN",
    parking: "",
    operationHours: "",
    lastOrder: "",
    content: "",
    tags: [],
  });


    const fileInputRef = useRef();

    const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 10)); // 최대 10개 제한
    };

    const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      tags: checked
        ? [...prev.tags, value]
        : prev.tags.filter((tag) => tag !== value),
    }));
  };

  const handleMenuChange = (index, field, value) => {
    const updatedMenus = [...menus];
    updatedMenus[index][field] = value;
    setMenus(updatedMenus);
  };

  const addMenu = () => {
    setMenus([...menus, { name: "", price: "" }]);
  };

  const removeMenu = (index) => {
    setMenus(menus.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData, menus, images);
  };

  return (
    <div className="store-register-container">
      <div className="store-register-header">
        <h1 className="store-register-title">반가워요, 사장님!</h1>
        <p className="store-register-subtitle">
          아래에 가게의 세부 정보를 입력해주세요
        </p>
      </div>
      <hr className="store-divider" />

      <form className="store-register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>가게 이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="가게 이름을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>한 줄 소개</label>
          <input
            type="text"
            name="intro"
            value={formData.intro}
            onChange={handleInputChange}
            placeholder="한 줄 소개를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>전화번호</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="전화번호를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>주소</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="주소를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="KOREAN">한식</option>
            <option value="CHINESE">중식</option>
            <option value="JAPANESE">일식</option>
            <option value="WESTERN">양식</option>
            <option value="ITALIAN">이탈리아</option>
            <option value="FRENCH">프랑스</option>
            <option value="ASIAN">아시아</option>
            <option value="MEXICAN">멕시코</option>
            <option value="OTHER">기타</option>
          </select>
        </div>

        <div className="form-group">
            <label>주차 가능 여부</label>
            <div className="radio-container">
                <label>
                <input
                    type="radio"
                    name="parking"
                    value="가능"
                    onChange={handleInputChange}
                    checked={formData.parking === "가능"}
                />
                가능
                </label>
                <label>
                <input
                    type="radio"
                    name="parking"
                    value="불가"
                    onChange={handleInputChange}
                    checked={formData.parking === "불가"}
                />
                불가
                </label>
            </div>
        </div>

        <div className="form-group-horizontal">
            <div className="form-item">
                <label>영업 시간</label>
                <input
                type="text"
                name="operationHours"
                value={formData.operationHours}
                onChange={handleInputChange}
                placeholder="영업 시간을 입력하세요"
                />
            </div>
            <div className="form-item">
                <label>마지막 주문</label>
                <input
                type="text"
                name="lastOrder"
                value={formData.lastOrder}
                onChange={handleInputChange}
                placeholder="마지막 주문 시간을 입력하세요"
                />
            </div>
        </div>

        <div className="form-group-full">
            <label>가게 상세 내용</label>
            <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="가게에 대한 상세 설명을 입력하세요"
            ></textarea>
            </div>

        <div className="form-group-tag-custom">
            <label className="tag-label">태그</label>
                <div className="tags-container-custom">
                    {["혼밥", "모임", "회식", "데이트", "감성", "노포", "부모님"].map((tag) => (
                    <label key={tag} className="tag-item">
                        <input
                            type="checkbox"
                            name="tags"
                            value={tag}
                            checked={formData.tags.includes(tag)}
                            onChange={(e) => {
                                if (e.target.checked && formData.tags.length >= 3) {
                                alert("태그는 최대 3개까지만 선택할 수 있습니다.");
                                return;
                                }
                                handleCheckboxChange(e);
                            }}
                            className="tag-checkbox"
                            />
                            {tag}
                    </label>
                    ))}
                </div>
            </div>        
            <div className="menu-section">
            <label className="menu-label">대표 메뉴</label>
                {menus.map((menu, index) => (
                    <div key={index} className="menu-row">
                    <input
                        type="text"
                        placeholder="메뉴 이름"
                        value={menu.name}
                        onChange={(e) => handleMenuChange(index, "name", e.target.value)}
                        className="menu-name-input"
                    />
                    <input
                        type="number"
                        placeholder="가격"
                        value={menu.price}
                        onChange={(e) => handleMenuChange(index, "price", e.target.value)}
                        className="menu-price-input"
                    />
                    <button
                        type="button"
                        onClick={() => removeMenu(index)}
                        className="menu-remove-button"
                        disabled={menus.length <= 3}
                    >
                        삭제
                    </button>
                    {index === menus.length - 1 && (
                        <button
                        type="button"
                        onClick={addMenu}
                        className="menu-add-button"
                        disabled={menus.length >= 10}
                        >
                        +
                        </button>
                    )}
                    </div>
                ))}
                </div>


        <div className="form-group-photos">
            <label>사진 업로드</label>
                <div className="photo-upload-container">
                    {images.map((img, index) => (
                        <div key={index} className="photo-preview">
                            <img src={img.preview} alt={`Preview ${index}`} />
                            <button
                            type="button"
                            className="photo-delete-button"
                            onClick={() => removeImage(index)}
                            >
                            &times;
                            </button>
                        </div>
                        ))}
                        {images.length < 10 && (
                    <button
                            type="button"
                            className="photo-add-button"
                            onClick={() => fileInputRef.current.click()}
                        >
                            +
                    </button>
                        )}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        />
                    </div>
                </div>

        <div className="button-group">
          <button type="button" onClick={() => navigate(-1)} className="back-button">
            이전
          </button>
          <button type="submit" className="submit-button">
            등록할게요
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreRegister;
