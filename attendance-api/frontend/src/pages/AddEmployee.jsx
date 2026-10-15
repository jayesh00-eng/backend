import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joiningDate: new Date().toISOString().slice(0, 10),
};

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api("/employees", {
        method: "POST",
        body: JSON.stringify(form),
      });

      navigate("/employees", {
        replace: true,
        state: { message: "Employee added successfully." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div>
          <h2>Employee Information</h2>
          <p className="muted">Enter the details below.</p>
        </div>
        <Link to="/employees">← Back to employees</Link>
      </div>

      {error && <p className="alert error">{error}</p>}

      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-grid">
          <div>
            <label>Full name *</label>
            <input
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Employee name"
              required
            />
          </div>

          <div>
            <label>Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              placeholder="employee@example.com"
              required
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={update}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label>Department *</label>
            <input
              name="department"
              value={form.department}
              onChange={update}
              placeholder="e.g. IT"
              required
            />
          </div>

          <div>
            <label>Designation</label>
            <input
              name="designation"
              value={form.designation}
              onChange={update}
              placeholder="e.g. Developer"
            />
          </div>

          <div>
            <label>Joining date</label>
            <input
              name="joiningDate"
              type="date"
              value={form.joiningDate}
              onChange={update}
            />
          </div>
        </div>

        <div className="form-actions">
          <Link className="secondary-button" to="/employees">Cancel</Link>
          <button className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </form>
    </section>
  );
}