import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Shop Easy
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/admin/add">Add Product</Link>
      </div>
    </nav>
  );
}