import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...product,
            price: Number(product.price),
            stock: Number(product.stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Product add failed");
        return;
      }

      alert("Product Added Successfully");

      navigate("/admin-products");

    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="form-container">

      <h1>Add Product</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={product.image}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Add Product
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin-products")}
        >
          Cancel
        </button>

      </form>

    </div>
  );
}

export default AddProduct;