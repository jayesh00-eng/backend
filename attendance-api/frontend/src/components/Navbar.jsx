import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("attendanceToken");
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="brand">Employee<span>Atted</span></div>

      <p className="nav-label">MAIN MENU</p>

      <nav>
        <NavLink to="/" end className="nav-link">
          <span>▦</span> Dashboard
        </NavLink>

        <NavLink to="/employees" className="nav-link">
          <span>♙</span> Employees
        </NavLink>

        <NavLink to="/employees/add" className="nav-link">
          <span>＋</span> Add Employee
        </NavLink>

        <NavLink to="/attendance" className="nav-link">
          <span>✓</span> Attendance
        </NavLink>
      </nav>

      <button className="logout-button" onClick={logout}>
        ↪ Logout
      </button>
    </aside>
  );
}