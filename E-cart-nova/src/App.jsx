import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerHome from "./pages/CustomerHome";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// ADMIN
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCategories from "./pages/AdminCategories";
import AdminInventory from "./pages/AdminInventory";
import AdminReports from "./pages/AdminReports";

import Navbar from "./components/Navbar";
import ProtectedAdmin from "./components/ProtectedAdmin";

const withNavbar = (page) => (
  <>
    <Navbar />
    {page}
  </>
);

const adminOnly = (page) => (
  <ProtectedAdmin>
    {page}
  </ProtectedAdmin>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= CUSTOMER / COMMON LOGIN ================= */}

        {/* Main Login Page - Customer + Admin */}
        <Route path="/" element={<Login />} />

        {/* Login path */}
        <Route path="/login" element={<Login />} />

        {/* Agar kahin /admin-login use ho raha hai,
            tab bhi same Customer + Admin Login page open hoga */}
        <Route path="/admin-login" element={<Login />} />

        {/* Customer Register */}
        <Route path="/register" element={<Register />} />

        {/* Customer Pages */}
        <Route
          path="/customer-home"
          element={withNavbar(<CustomerHome />)}
        />

        <Route
          path="/products"
          element={withNavbar(<Products />)}
        />

        <Route
          path="/cart"
          element={withNavbar(<Cart />)}
        />

        <Route
          path="/checkout"
          element={withNavbar(<Checkout />)}
        />

        <Route
          path="/orders"
          element={withNavbar(<Orders />)}
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin-dashboard"
          element={adminOnly(<AdminDashboard />)}
        />

        <Route
          path="/admin-products"
          element={adminOnly(<AdminProducts />)}
        />

        <Route
          path="/admin-orders"
          element={adminOnly(<AdminOrders />)}
        />

        <Route
          path="/admin-customers"
          element={adminOnly(<AdminCustomers />)}
        />

        <Route
          path="/admin-categories"
          element={adminOnly(<AdminCategories />)}
        />

        <Route
          path="/admin-inventory"
          element={adminOnly(<AdminInventory />)}
        />

        <Route
          path="/admin-reports"
          element={adminOnly(<AdminReports />)}
        />


        {/* ================= PRODUCT - ADMIN ONLY ================= */}

        <Route
          path="/add-product"
          element={adminOnly(<AddProduct />)}
        />

        <Route
          path="/edit-product/:id"
          element={adminOnly(<EditProduct />)}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;