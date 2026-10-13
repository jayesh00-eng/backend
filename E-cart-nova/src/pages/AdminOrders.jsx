import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { API_URL, formatMoney } from "../config";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        alert("Status update failed");
        return;
      }

      const data = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, status, paymentStatus: data.order.paymentStatus }
            : o
        )
      );
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  const visibleOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Orders</h1>
            <p>Manage customer orders ({orders.length} total)</p>
          </div>

          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Orders</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-box">
          {loading ? (
            <p>Loading orders...</p>
          ) : visibleOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>
                        {order.customer?.name || order.address?.name || "Customer"}
                        <br />
                        <small>{order.address?.phone}</small>
                      </td>
                      <td>
                        {order.items.map((item, i) => (
                          <div key={i}>
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td>{formatMoney(order.totalAmount)}</td>
                      <td>
                        {order.paymentMethod || "COD"}
                        <br />
                        <span
                          className={`status ${
                            order.paymentStatus === "Paid" ? "delivered" : "pending"
                          }`}
                        >
                          {order.paymentStatus || "Pending"}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminOrders;