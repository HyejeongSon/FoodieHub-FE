import React, { useEffect, useState, useRef } from 'react';
import "../../styles/StoreRegister.css";
import "../../styles/EditMyStore.css";

function EditMyStore() {
  const [store, setStore] = useState({});
  const [menus, setMenus] = useState([]);
  const [images, setImages] = useState([]);
  const [newMenu, setNewMenu] = useState({ name: '', price: '' });
  const [newImage, setNewImage] = useState(null);

  const fileInputRef = useRef();

  useEffect(() => {
    fetchStoreData();
    loadMenus();
    loadImages();
  }, []);

  // 식당 정보 조회
  const fetchStoreData = async () => {
    const response = await fetch(`/api/store/update`);
    const data = await response.json();
    console.log(data);
    setStore(data.store);
  };

  // 식당 정보 수정
  const saveStore = async () => {
    try {
      const response = await fetch(`/api/store/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(store),
      });

      if (response.ok) {
        alert('가게 정보가 저장되었습니다.');
      } else {
        alert('가게 정보를 저장하는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving store:', error);
      alert('가게 정보를 저장하는 중 오류가 발생했습니다.');
    }
  };

  // 메뉴 리스트 로드
  const loadMenus = async () => {
    try {
      const response = await fetch(`/api/store/menu`);
      if (!response.ok) {
        throw new Error('Failed to fetch menus');
      }
      const data = await response.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading menus:', error);
      alert('메뉴 데이터를 불러오는데 실패했습니다.');
    }
  };

  // 메뉴 핸들러
  const handleMenuChange = (e, menuId, field) => {
    setMenus(menus.map(menu => menu.id === menuId ? { ...menu, [field]: e.target.value } : menu));
  };

  // 메뉴 등록
  const addMenu = async () => {
    if (!newMenu.name || isNaN(newMenu.price)) {
      alert('메뉴 이름과 가격을 입력해주세요.');
      return;
    }

    const response = await fetch(`/api/store/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMenu),
    });

    if (response.ok) {
      setNewMenu({ name: '', price: '' });
      loadMenus();
    } else {
      alert('메뉴 등록 실패!');
    }
  };

  // 메뉴 수정
  const updateMenu = async (menuId) => {
    const menuToUpdate = menus.find(menu => menu.id === menuId);
    if (!menuToUpdate) return;

    const response = await fetch(`/api/store/menu`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuToUpdate),
    });

    if (response.ok) {
      loadMenus();
      alert('메뉴가 성공적으로 수정되었습니다.');
    } else {
      alert('메뉴 수정 실패!');
    }
  };

  // 메뉴 삭제
  const deleteMenu = async (menuId) => {
    if (!window.confirm('메뉴를 삭제하시겠습니까?')) return;

    const response = await fetch(`/api/store/menu/${menuId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      loadMenus();
    } else {
      alert('메뉴 삭제 실패!');
    }
  };

  // 이미지 로드
  const loadImages = async () => {
    const response = await fetch(`/api/store/images`);
    const data = await response.json();
    setImages(data);
  };

  // 이미지 핸들러
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  // 이미지 등록
  const addImage = async () => {
    if (!newImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', newImage);

    const response = await fetch(`/api/store/images`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setNewImage(null);
      loadImages();
    } else {
      alert('이미지 등록 실패!');
    }
  };

  // 이미지 삭제
  const deleteImage = async (imageId) => {
    if (!window.confirm('이미지를 삭제하시겠습니까?')) return;

    const response = await fetch(`/api/store/images/${imageId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      loadImages();
    } else {
      alert('이미지 삭제 실패!');
    }
  };

  return (
    <div className="store-register-container">
      <div className="store-register-header">
        <h1 className="store-register-title">반가워요, 사장님!</h1>
        <p className="store-register-subtitle">
          아래에 가게의 세부 정보를 변경해주세요
        </p>
      </div>
      <hr className="store-divider" />

      <form className="store-register-form">
        {/* 가게 정보 */}
        <div className="form-group">
          <label>가게 이름:</label>
          <input
            type="text"
            value={store.name || ''}
            onChange={(e) => setStore({ ...store, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>가게 한줄 소개:</label>
          <input
            type="text"
            value={store.intro || ''}
            onChange={(e) => setStore({ ...store, intro: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>가게 전화번호:</label>
          <input
            type="text"
            value={store.phone || ''}
            onChange={(e) => setStore({ ...store, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>가게 주소:</label>
          <input
            type="text"
            value={store.address || ''}
            onChange={(e) => setStore({ ...store, address: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>카테고리:</label>
          <select
            value={store.category || ''}
            onChange={(e) => setStore({ ...store, category: e.target.value })}
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

        <div className="form-group-horizontal">
          <div className="form-item">
            <label>영업 시간:</label>
            <input
              type="text"
              value={store.operationHours || ''}
              onChange={(e) => setStore({ ...store, operationHours: e.target.value })}
            />
          </div>
          <div className="form-item">
            <label>마지막 주문:</label>
            <input
              type="text"
              value={store.lastOrder || ''}
              onChange={(e) => setStore({ ...store, lastOrder: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group-full">
          <label>가게 상세 내용:</label>
          <textarea
            value={store.content || ''}
            onChange={(e) => setStore({ ...store, content: e.target.value })}
          ></textarea>
        </div>

        <div className="form-group-tag-custom">
          <label className="tag-label">태그</label>
          <div className="tags-container-custom">
            {["혼밥", "모임", "회식", "데이트", "감성", "노포", "부모님"].map((tag) => (
              <label key={tag} className="tag-item">
                <input
                  className="tag-checkbox"
                  type="checkbox"
                  checked={store.tags?.includes(tag)}
                  onChange={(e) => {
                    const newTags = e.target.checked
                      ? [...(store.tags || []), tag]
                      : (store.tags || []).filter((t) => t !== tag);
                    setStore({ ...store, tags: newTags });
                  }}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <div className="Editinfo_button">
          <button type="button" onClick={saveStore}>
            저장
          </button>
        </div>
      </form>

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
                        onClick={() => deleteMenu(index)}
                        className="menu-remove-button"
                        disabled={menus.length <= 3}
                    >
                        삭제
                    </button>
                    {index === menus.length - 1 && (
                        <button
                        type="button"
                        onClick={updateMenu}
                        className="menu-add-button"
                        disabled={menus.length >= 10}
                        >
                        +
                        </button>
                    )}
                    </div>
                ))}
        <div className='Editinfo_button'>
        <button onClick={addMenu} className="Editinfo_button">메뉴 등록</button>
        </div>
      </div>

      <div className="store-register-form">
        <div className="photo-upload-container">
          <label>사진 업로드:</label>
          {images.map((image) => (
            <div key={image.id}>
              <img
                src={`/api/store/image/${image.storeImageName}`}
                alt="이미지"
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px', marginBottom: '5px' }}
              />
              <button onClick={() => deleteImage(image.id)}>삭제</button>
            </div>
          ))}
            <button
                type="button"
                className="photo-add-button"
                onClick={() => fileInputRef.current.click()}
                        >
                +
            </button>
            <input type="file" 
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange} />
        </div>
      </div>
      <div className="Editinfo_button">
            <button className="image-upload-button" onClick={addImage}>사진 등록</button>
          </div>
    </div>
  );
}

export default EditMyStore;
