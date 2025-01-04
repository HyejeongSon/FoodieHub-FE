import React, { useState } from "react";
import "../../styles/StoreDetail.css";

const MenuList = () => {
  const allMenus = [
    { name: "소곱창", price: "₩30,000" },
    { name: "돼지고기", price: "₩20,000" },
    { name: "양고기", price: "₩10,000" },
    { name: "소고기", price: "₩86,800" },
    { name: "물고기", price: "₩15,000" },
    { name: "닭고기", price: "₩12,000" },
    { name: "오리고기", price: "₩18,000" },
  ];

  const [isExpanded, setIsExpanded] = useState(false);
  const visibleMenus = isExpanded ? allMenus : allMenus.slice(0, 4);

  const toggleMenuVisibility = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="menu-container">
      <ul className="menu-list">
        {visibleMenus.map((menu, index) => (
          <li key={index} className="menu-item">
            <span className="menu-name">{menu.name}</span>
            <span className="menu-price">{menu.price}</span>
          </li>
        ))}
      </ul>
      <button className="menu-toggle-btn" onClick={toggleMenuVisibility}>
        {isExpanded ? "메뉴 닫기 ▲" : "메뉴 더 보기 ▼"}
      </button>
    </div>
  );
};

export default MenuList;
