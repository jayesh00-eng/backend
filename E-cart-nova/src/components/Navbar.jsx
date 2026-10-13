import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        E-Cart Nova
      </div>

      <div className="navbar-links">

        <Link to="/customer-home">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          🛒 Cart
        </Link>

        <Link to="/orders">
          Orders
        </Link>

        <span className="navbar-user">
          {user.name || "Customer"}
        </span>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;