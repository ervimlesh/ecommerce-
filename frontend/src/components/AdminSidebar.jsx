import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

const AdminSidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {isSidebarVisible ? <RxCross2 size={24} /> : <RxHamburgerMenu size={24} />}
        {isSidebarVisible ? "Close" : "Menu"}
      </button>

      <div className={`admin-sidebar ${!isSidebarVisible ? "hidden" : ""}`}>
        <h5>Admin Panel</h5>
        <NavLink to="/dashboard/admin/create-product">Add Product</NavLink>
        <NavLink to="#">Show Products</NavLink>
        <NavLink to="/dashboard/admin/create-category">Add Category</NavLink>
        <NavLink to="#">Show Categories</NavLink>
        <NavLink to="/dashboard/admin/orders">Orders</NavLink>
        <NavLink to="/dashboard/admin/reviews">Reviews</NavLink>
      </div>
    </>
  );
};

export default AdminSidebar;
