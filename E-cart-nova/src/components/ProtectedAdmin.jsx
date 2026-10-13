import { Navigate } from "react-router-dom";

// Sirf logged-in admin hi andar ja sakta hai
function ProtectedAdmin({ children }) {
  let admin = null;

  try {
    admin = JSON.parse(localStorage.getItem("admin"));
  } catch {
    admin = null;
  }

  if (!admin || admin.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedAdmin;