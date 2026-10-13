import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { API_URL, formatMoney } from "../config";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalSales: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/stats`),
          fetch(`${API_URL}/api/orders`),
        ]);

        setStats(await statsRes.json());

        const orders = await ordersRes.json();
        setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cards = [
    { icon: "🛍️", label: "Total Products", value: stats.totalProducts },
    { icon: "📦", label: "Total Orders", value: stats.totalOrders },
    { icon: "👥", label: "Total Customers", value: stats.totalCustomers },
    { icon: "💰", label: "Total Sales", value: formatMoney(stats.totalSales) },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to E-Cart Nova Admin Panel</p>
          </div>
          <div className="admin-user">👤 Admin</div>
        </div>

        <div className="dashboard-cards">
          {cards.map((card) => (
            <div className="dashboard-card" key={card.label}>
              <div className="dashboard-icon">{card.icon}</div>
              <div>
                <p>{card.label}</p>
                <h2>{loading ? "..." : card.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-box">
          <div className="box-header">
            <h2>Recent Orders</h2>
            <Link to="/admin-orders">View All</Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4">Abhi tak koi order nahi aaya.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.customer?.name || order.address?.name || "Customer"}</td>
                      <td>{formatMoney(order.totalAmount)}</td>
                      <td>
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-box">
          <h2>Quick Actions</h2>

          <div className="quick-actions">
            <Link to="/admin-products">
              🛍️<span>Manage Products</span>
            </Link>
            <Link to="/admin-orders">
              📦<span>Manage Orders</span>
            </Link>
            <Link to="/admin-customers">
              👥<span>Customers</span>
            </Link>
            <Link to="/admin-inventory">
              📋<span>Inventory</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;