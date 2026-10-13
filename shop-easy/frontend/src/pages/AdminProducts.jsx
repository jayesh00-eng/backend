import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  updateProduct,
} from "../services/productService";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((response) => {
        const p = response.data;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: String(p.price),
          category: p.category || "Electronics",
          image: p.image || "",
          stock: String(p.stock ?? 0),
        });
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Product not found")
      );
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.category ||
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0 ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      setError("Please enter valid product details.");
      return;
    }

    try {
      setSaving(true);
      await updateProduct(id, form);
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <main className="container">
        {error || "Loading product..."}
      </main>
    );
  }

  return (
    <main className="container form-container">
      <h1>Edit Product</h1>

      {error && <p className="error-message">{error}</p>}

      <form className="product-form" onSubmit={handleSubmit}>
        <label>Product Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
        />

        <label>Price (₹) *</label>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label>Category *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home</option>
          <option>Accessories</option>
        </select>

        <label>Image URL</label>
        <input
          name="image"
          type="url"
          value={form.image}
          onChange={handleChange}
        />

        <label>Stock *</label>
        <input
          name="stock"
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <button className="btn" disabled={saving}>
          {saving ? "Updating..." : "Update Product"}
        </button>
      </form>
    </main>
  );
}