import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  return (
    <aside className="admin-sidebar">

      <div className="admin-logo">
        <h2>E-Cart Nova</h2>
        <span>ADMIN PANEL</span>
      </div>

      <nav>

        <Link to="/admin-dashboard">
          📊 Dashboard
        </Link>

        <Link to="/admin-products">
          🛍️ Products
        </Link>

        <Link to="/admin-orders">
          📦 Orders
        </Link>

        <Link to="/admin-customers">
          👥 Customers
        </Link>

        <Link to="/admin-categories">
          📁 Categories
        </Link>

        <Link to="/admin-inventory">
          📋 Inventory
        </Link>

        <Link to="/admin-reports">
          📈 Reports
        </Link>

      </nav>

      <button
        className="admin-logout"
        onClick={logout}
      >
        🚪 Logout
      </button>

    </aside>
  );
}

export default AdminSidebar;