import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { postStoreSave } from "../../store/StoreStore";
import "../../styles/StoreRegister.css";

const StoreRegister = () => {
    const navigate = useNavigate();

    const [menus, setMenus] = useState([{ name: '', price: '' }]);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        intro: '',
        phone: '',
        address: '',
        category: 'KOREAN',
        parking: '',
        operationHours: '',
        lastOrder: '',
        content: '',
        tags: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => {
            const tags = checked
                ? [...prevData.tags, value]
                : prevData.tags.filter((tag) => tag !== value);
            return { ...prevData, tags };
        });
    };

    const handleMenuChange = (index, field, value) => {
        const updatedMenus = [...menus];
        updatedMenus[index][field] = value;
        setMenus(updatedMenus);
    };

    const addMenu = () => {
        setMenus([...menus, { name: '', price: '' }]);
    };

    const removeMenu = (index) => {
        const updatedMenus = menus.filter((_, i) => i !== index);
        setMenus(updatedMenus);
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const filePreviews = files.map((file) => {
            return {
                file,
                preview: URL.createObjectURL(file),
            };
        });
        setImages((prevImages) => [...prevImages, ...filePreviews]);
    };
    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(menus);
        console.log(images);
        console.log(formData);
        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'tags') {
                value.forEach((tag) => submissionData.append(key, tag));
            } else {
                submissionData.append(key, value);
            }
        });

        menus.forEach((menu, index) => {
            submissionData.append(`menus[${index}].name`, menu.name);
            submissionData.append(`menus[${index}].price`, menu.price);
        });

        images.forEach((image, index) => {
            submissionData.append(`images[${index}]`, image.file);
        });

        console.log("Form data submitted:");
        for (let [key, value] of submissionData.entries()) {
            console.log(`${key}: ${value}`);
        }
        // 서버로 데이터 전송 로직 추가
        try {
            await postStoreSave('POST', '/api/store/save', submissionData);
            alert('가게 정보가 저장되었습니다.');
            navigate('/mystore');
        } catch (error) {
            console.error('Error:', error);
            alert('가게 정보 저장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="store-register-container">
            <p class="store-register-title">가게 정보 저장</p>
            <hr className="divider" />

            <form className="store-register-form"
                onSubmit={handleSubmit}>
                        
                <div className='form-group'>
                    <label>가게 이름:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="가게 이름"
                    /><br />
                </div>        


                <div className='form-group'>
                    <label>가게 한줄 소개:</label>
                    <input
                        type="text"
                        name="intro"
                        value={formData.intro}
                        onChange={handleInputChange}
                        placeholder="가게 한줄 소개"
                    /><br />
                </div>        


                <div className='form-group'>
                    <label>가게 전화번호:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="가게 전화번호"
                    /><br />
                </div>        


                
                <div className='form-group'>
                    <label>가게 주소:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="가게 주소"
                    /><br />
                </div>        



                <div className='form-group'>
                    <label>카테고리:</label>
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
                    </select><br />    
                </div>        


                <div className='form-group'>
                    <label>주차 가능 여부:</label>
                    <label>
                        <input
                            type="radio"
                            name="parking"
                            value="1"
                            checked={formData.parking === '1'}
                            onChange={handleInputChange}
                        /> 가능
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="parking"
                            value="0"
                            checked={formData.parking === '0'}
                            onChange={handleInputChange}
                        /> 불가
                    </label><br />
                </div>       


                <div className='form-group'>
                    <label>영업 시간:</label>
                    <input
                        type="text"
                        name="operationHours"
                        value={formData.operationHours}
                        onChange={handleInputChange}
                        placeholder="영업 시간"
                    /><br />
                </div>        


                <div className='form-group'>
                    <label>마지막 주문:</label>
                    <input
                        type="text"
                        name="lastOrder"
                        value={formData.lastOrder}
                        onChange={handleInputChange}
                        placeholder="마지막 주문"
                    /><br />
                </div>        


                <div className='form-group'>
                    <label>가게 상세 내용:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="가게 상세 내용"
                    ></textarea><br />
                </div>        


                <div className='form-group'>
                    <label>태그:</label>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="tags"
                                value="혼밥"
                                checked={formData.tags.includes('혼밥')}
                                onChange={handleCheckboxChange}
                            /> 혼밥
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="tags"
                                value="모임"
                                checked={formData.tags.includes('모임')}
                                onChange={handleCheckboxChange}
                            /> 모임
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="tags"
                                value="회식"
                                checked={formData.tags.includes('회식')}
                                onChange={handleCheckboxChange}
                            /> 회식
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="tags"
                                value="데이트"
                                checked={formData.tags.includes('데이트')}
                                onChange={handleCheckboxChange}
                            /> 데이트
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="tags"
                                value="감성"
                                checked={formData.tags.includes('감성')}
                                onChange={handleCheckboxChange}
                            /> 감성
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="tags"
                                value="노포"
                                checked={formData.tags.includes('노포')}
                                onChange={handleCheckboxChange}
                            /> 노포
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="tags"
                                value="부모님"
                                checked={formData.tags.includes('부모님')}
                                onChange={handleCheckboxChange}
                            /> 부모님
                        </label>
                    </div><br />
                </div>        



                <div className='form-group'>
                    <label>메뉴 리스트:</label>
                    <div>
                        {menus.map((menu, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    placeholder="메뉴 이름"
                                    value={menu.name}
                                    onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="메뉴 가격"
                                    value={menu.price}
                                    onChange={(e) => handleMenuChange(index, 'price', e.target.value)}
                                />
                                <button type="button" onClick={() => removeMenu(index)}>삭제</button>
                            </div>
                        ))}
                        <button type="button" onClick={addMenu}>메뉴 추가</button>
                    </div><br />
                </div>        



                <div className='form-group'>
                    <label>사진 업로드</label>
                    <div>
                        <input type="file" multiple onChange={handleImageChange} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {images.map((img, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={img.preview}
                                        alt={`Preview ${index}`}
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '12px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div><br />
                </div>        



                <div className="button-group">
                    <button className="prebtn" type="button" onClick={() => navigate('/mystore')}>
                            이전
                    </button>
                    <button className="savebtn" type="submit">저장</button>
                </div>
            </form>

        </div>

    );
};

export default StoreRegister;