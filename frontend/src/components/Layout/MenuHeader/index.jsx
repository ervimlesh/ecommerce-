import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const MenuHeader = () => {
  const [category, setCategory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategory(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const toggleExpand = (name) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderCategories = (categories, isMobile = false) => {
    return categories.map((category) => (
      <li key={category._id}>
        {category.children.length > 0 ? (
          <>
            <div
              className={`category-parent ${isMobile ? "mobile" : ""}`}
              onClick={() => isMobile && toggleExpand(category._id)}
            >
              {category.parentId ? (
                <a
                  href={`/${category.slug}?category=${category.name}&cid=${category._id}&type=${category.type}`}
                >
                  {category.name}
                </a>
              ) : (
                <span>{category.name}</span>
              )}
              {isMobile &&
                (expandedItems[category._id] ? (
                  <FaAngleUp className="icon" />
                ) : (
                  <FaAngleDown className="icon" />
                ))}
            </div>
            <ul
              className={`${
                isMobile
                  ? expandedItems[category._id]
                    ? "expanded"
                    : "collapsed"
                  : ""
              }`}
            >
              {renderCategories(category.children, isMobile)}
            </ul>
          </>
        ) : (
          <div className="category-leaf">
            {category.parentId ? (
              <a
                href={`/${category.slug}?category=${category.name}&cid=${category._id}&type=${category.type}`}
              >
                {category.name}
              </a>
            ) : (
              <span>{category.name}</span>
            )}
          </div>
        )}
      </li>
    ));
  };

  return (
    <div className="menuHeader">
      <div className="menu-toggle">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoMdClose size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <ul className={`menu-list ${menuOpen ? "open" : ""}`}>
        {category.length > 0 ? renderCategories(category, true) : null}
      </ul>

      {/* Desktop version */}
      <ul className="desktop-menu">
        {category.length > 0 ? renderCategories(category, false) : null}
      </ul>
    </div>
  );
};

export default MenuHeader;
