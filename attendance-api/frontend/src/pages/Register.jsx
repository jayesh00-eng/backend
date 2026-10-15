import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      navigate("/login", {
        replace: true,
        state: { message: "Registration successful. Please login." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">ST</div>
        <h1>Create account</h1>
        <p className="muted">Register to manage employee attendance.</p>

        {error && <p className="alert error">{error}</p>}

        <label>Full name</label>
        <input
          name="name"
          value={form.name}
          onChange={update}
          placeholder="Enter your name"
          required
        />

        <label>Email address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={update}
          placeholder="you@example.com"
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={update}
          placeholder="At least 6 characters"
          minLength={6}
          required
        />

        <button className="primary-button full-button" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}