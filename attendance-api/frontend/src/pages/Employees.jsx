import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../services/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joiningDate: "",
};

export default function Employees() {
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadEmployees(query = search) {
    setLoading(true);
    setError("");

    try {
      const data = await api(`/employees?search=${encodeURIComponent(query)}`);
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees("");
  }, []);

  function startEdit(employee) {
    setEditing(employee._id);
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joiningDate: employee.joiningDate || "",
    });
    setError("");
    setMessage("");
  }

  async function saveEdit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api(`/employees/${editing}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      setEditing(null);
      setMessage("Employee updated successfully.");
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteEmployee(employee) {
    if (!window.confirm(`Delete ${employee.name}?`)) return;

    setError("");
    setMessage("");

    try {
      await api(`/employees/${employee._id}`, { method: "DELETE" });
      setMessage("Employee deleted successfully.");
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  }

  function updateForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <>
      {message && <p className="alert success">{message}</p>}
      {error && <p className="alert error">{error}</p>}

      {editing && (
        <section className="panel edit-panel">
          <h2>Edit Employee</h2>

          <form onSubmit={saveEdit}>
            <div className="form-grid">
              {[
                ["name", "Full name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["department", "Department"],
                ["designation", "Designation"],
                ["joiningDate", "Joining date"],
              ].map(([field, label]) => (
                <div key={field}>
                  <label>{label}</label>
                  <input
                    name={field}
                    type={field === "joiningDate" ? "date" : field === "email" ? "email" : "text"}
                    value={form[field]}
                    onChange={updateForm}
                    required={["name", "email", "department"].includes(field)}
                  />
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button className="primary-button">Update Employee</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>All Employees</h2>
            <p className="muted">{employees.length} employees shown</p>
          </div>
          <Link className="primary-button" to="/employees/add">
            + Add Employee
          </Link>
        </div>

        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            loadEmployees(search);
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or department..."
          />
          <button className="primary-button">Search</button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setSearch("");
              loadEmployees("");
            }}
          >
            Clear
          </button>
        </form>

        {loading ? (
          <p className="empty-state">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="empty-state">No employees found. Add your first employee.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <strong>{employee.name}</strong>
                      <div className="muted small-text">{employee.email}</div>
                    </td>
                    <td>{employee.department}</td>
                    <td>{employee.designation || "—"}</td>
                    <td>{employee.phone || "—"}</td>
                    <td>
                      <div className="action-row">
                        <button
                          className="small-button edit-button"
                          onClick={() => startEdit(employee)}
                        >
                          Edit
                        </button>
                        <button
                          className="small-button delete-button"
                          onClick={() => deleteEmployee(employee)}
                        >
                          Delete
                        </button>
                      </div>
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