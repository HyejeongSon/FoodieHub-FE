import React, { useState } from "react";
import "../../styles/StoreDetail.css";

const MenuList = ({ menus }) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const visibleMenus = isExpanded ? menus : menus.slice(0, 4);

  const toggleMenuVisibility = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="menu-container">
      <ul className="menu-list">
        {visibleMenus.map((menu, index) => (
          <li key={index} className="menu-item">
            <span className="menu-name">{menu.name}</span>
            <span className="menu-price">₩{menu.price.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      {menus.length > 4 && (
        <button className="menu-toggle-btn" onClick={toggleMenuVisibility}>
          {isExpanded ? "메뉴 닫기 ▲" : "메뉴 더 보기 ▼"}
        </button>
      )}
    </div>
  );
};

export default MenuList;
