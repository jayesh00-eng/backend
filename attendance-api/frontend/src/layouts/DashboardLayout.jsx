import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const titles = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/employees/add": "Add Employee",
  "/attendance": "Attendance Management",
};

export default function DashboardLayout() {
  const location = useLocation();
  const title = titles[location.pathname] || "Employee Management";

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">EMPLOYEE MANAGEMENT SYSTEM</p>
            <h1>{title}</h1>
          </div>
          <div className="header-badge">Admin Panel</div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}