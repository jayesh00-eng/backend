import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid admin email or password");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(data.user));
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error. Backend chal raha hai ya nahi check karein.");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>E-Cart Nova</h1>
        <h2>Admin Login</h2>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <div className="admin-demo">
          <p>Demo Admin</p>
          <p>Email: admin@ecart.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;