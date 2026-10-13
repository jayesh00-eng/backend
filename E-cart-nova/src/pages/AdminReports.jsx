import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { API_URL, formatMoney } from "../config";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function AdminReports() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((error) => console.log(error));
  }, []);

  // Cancelled orders ko revenue me count nahi karte
  const valid = orders.filter((o) => o.status !== "Cancelled");

  const revenue = valid.reduce((sum, o) => sum + o.totalAmount, 0);

  const productsSold = valid.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const customerCount = new Set(
    valid.map((o) => o.customer?._id).filter(Boolean)
  ).size;

  // Last 6 months
  const now = new Date();
  const monthly = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const total = valid
      .filter((o) => {
        const c = new Date(o.createdAt);
        return c.getMonth() === d.getMonth() && c.getFullYear() === d.getFullYear();
      })
      .reduce((sum, o) => sum + o.totalAmount, 0);
    monthly.push({ label: MONTHS[d.getMonth()], total });
  }
  const maxMonth = Math.max(...monthly.map((m) => m.total), 1);

  // Top selling products
  const productMap = {};
  valid.forEach((o) =>
    o.items.forEach((i) => {
      if (!productMap[i.name]) productMap[i.name] = { name: i.name, sold: 0, revenue: 0 };
      productMap[i.name].sold += i.quantity;
      productMap[i.name].revenue += i.price * i.quantity;
    })
  );
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const cards = [
    { icon: "💰", label: "Total Revenue", value: formatMoney(revenue) },
    { icon: "📦", label: "Total Orders", value: valid.length },
    { icon: "🛍️", label: "Products Sold", value: productsSold },
    { icon: "👥", label: "Customers Ordered", value: customerCount },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Reports</h1>
            <p>Store sales and performance reports</p>
          </div>
        </div>

        <div className="dashboard-cards">
          {cards.map((c) => (
            <div className="dashboard-card" key={c.label}>
              <div className="dashboard-icon">{c.icon}</div>
              <div>
                <p>{c.label}</p>
                <h2>{c.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-box">
          <h2>Monthly Sales (last 6 months)</h2>

          <div className="sales-chart">
            {monthly.map((m) => (
              <div key={m.label}>
                <small>{m.total ? formatMoney(m.total) : ""}</small>
                <div
                  className="bar"
                  style={{ height: `${Math.max((m.total / maxMonth) * 170, 4)}px` }}
                ></div>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-box">
          <h2>Top Selling Products</h2>

          {topProducts.length === 0 ? (
            <p>Abhi koi sale nahi hui.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.name}>
                      <td>{p.name}</td>
                      <td>{p.sold}</td>
                      <td>{formatMoney(p.revenue)}</td>
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

export default AdminReports;