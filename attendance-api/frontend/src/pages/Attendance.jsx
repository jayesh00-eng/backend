import { useEffect, useState } from "react";
import { api } from "../services/api";

function todayString() {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().slice(0, 10);
}

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(todayString());
  const [status, setStatus] = useState("Present");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadEmployees() {
    const data = await api("/employees");
    setEmployees(data);

    if (data.length && !employeeId) {
      setEmployeeId(data[0]._id);
    }
  }

  async function loadRecords(selectedDate = date) {
    setLoading(true);
    setError("");

    try {
      const data = await api(
        `/attendance?date=${encodeURIComponent(selectedDate)}`
      );
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees().catch((err) => setError(err.message));
    loadRecords();
  }, []);

  async function markAttendance(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api("/attendance/mark", {
        method: "POST",
        body: JSON.stringify({ employeeId, date, status }),
      });

      setMessage("Attendance saved successfully.");
      await loadRecords(date);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {error && <p className="alert error">{error}</p>}
      {message && <p className="alert success">{message}</p>}

      <section className="panel form-panel">
        <h2>Mark Employee Attendance</h2>
        <p className="muted">Choose an employee, date and status.</p>

        {employees.length === 0 ? (
          <p className="empty-state">
            No employees available. <a href="/employees/add">Add an employee</a> first.
          </p>
        ) : (
          <form onSubmit={markAttendance}>
            <div className="form-grid">
              <div>
                <label>Employee *</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                >
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} — {employee.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="primary-button">Save Attendance</button>
            </div>
          </form>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Attendance Records</h2>
            <p className="muted">Filter attendance by date.</p>
          </div>
        </div>

        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            loadRecords(date);
          }}
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button className="primary-button">Search</button>
        </form>

        {loading ? (
          <p className="empty-state">Loading attendance...</p>
        ) : records.length === 0 ? (
          <p className="empty-state">No attendance records found for this date.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td>{record.employee?.name || "Unknown"}</td>
                    <td>{record.employee?.department || "—"}</td>
                    <td>{record.date}</td>
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