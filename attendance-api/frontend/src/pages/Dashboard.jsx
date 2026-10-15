import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    notMarked: 0,
  });
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      try {
        const [stats, records] = await Promise.all([
          api(`/attendance/summary?date=${today}`),
          api(`/attendance?date=${today}`),
        ]);

        setSummary(stats);
        setRecent(records.slice(0, 5));
      } catch (err) {
        setError(err.message);
      }
    }

    load();
  }, [today]);

  const cards = [
    { label: "Total Employees", value: summary.totalEmployees, icon: "♙" },
    { label: "Present Today", value: summary.present, icon: "✓" },
    { label: "Absent Today", value: summary.absent, icon: "×" },
    { label: "Not Marked", value: summary.notMarked, icon: "◷" },
  ];

  return (
    <>
      <section className="welcome-banner">
        <div>
          <p className="eyebrow light">TODAY'S OVERVIEW</p>
          <h2>Manage your team efficiently.</h2>
          <p>Track employees and keep attendance records organized.</p>
        </div>
        <Link className="banner-button" to="/employees/add">
          + Add Employee
        </Link>
      </section>

      {error && <p className="alert error">{error}</p>}

      <section className="stats-grid">
        {cards.map((card) => (
          <article className="stat-card" key={card.label}>
            <div className="stat-icon">{card.icon}</div>
            <p>{card.label}</p>
            <h2>{card.value}</h2>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Today's Attendance</h2>
            <p className="muted">{today}</p>
          </div>
          <Link to="/attendance">View all →</Link>
        </div>

        {recent.length === 0 ? (
          <p className="empty-state">
            No attendance marked yet. Add employees and mark attendance.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((record) => (
                  <tr key={record._id}>
                    <td>{record.employee?.name || "Employee"}</td>
                    <td>{record.employee?.department || "—"}</td>
                    <td>
                      <span className={`status ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}