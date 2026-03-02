import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="admin-main">
        <h3>Welcome Admin</h3>
        <p>Use the sidebar to manage products and categories.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
