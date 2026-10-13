import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminProducts from "./pages/AdminProducts";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/add" element={<AddProduct />} />
        <Route path="/admin/edit/:id" element={<EditProduct />} />

        <Route path="*" element={<main className="container"><h1>404 - Page Not Found</h1></main>} />
      </Routes>
    </BrowserRouter>
  );
}