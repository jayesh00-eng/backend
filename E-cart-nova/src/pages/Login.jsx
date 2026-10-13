import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../config";

function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("customer");

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const switchType = (type) => {
    setLoginType(type);

    setUser({
      email: "",
      password: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        loginType === "admin" ? "/admin-login" : "/login";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password");
        return;
      }

      if (loginType === "admin") {
        // Old login remove
        localStorage.removeItem("user");

        // Save admin
        localStorage.setItem("admin", JSON.stringify(data.user));

        navigate("/admin-dashboard");
      } else {
        // Old admin login remove
        localStorage.removeItem("admin");

        // Save customer
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/customer-home");
      }
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "Server error. Please check whether the backend server is running."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h1>E-Cart Nova</h1>

        <h2>
          {loginType === "admin"
            ? "Admin Login"
            : "Customer Login"}
        </h2>

        {/* Customer / Admin Options */}
        <div className="login-options">

          <button
            type="button"
            className={
              loginType === "customer"
                ? "login-option active"
                : "login-option"
            }
            onClick={() => switchType("customer")}
          >
            👤 Customer
          </button>

          <button
            type="button"
            className={
              loginType === "admin"
                ? "login-option active"
                : "login-option"
            }
            onClick={() => switchType("admin")}
          >
            🔐 Admin
          </button>

        </div>

        <form onSubmit={handleLogin} autoComplete="off">

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={user.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={user.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button type="submit">
            {loginType === "admin"
              ? "Admin Login"
              : "Customer Login"}
          </button>

        </form>

        {/* Sirf Customer ke liye Register */}
        {loginType === "customer" && (
          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;