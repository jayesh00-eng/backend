import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../services/productService";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProduct(id)
      .then((response) => setProduct(response.data))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Unable to load product"
        )
      );
  }, [id]);

  if (error) return <main className="container">{error}</main>;
  if (!product) return <main className="container">Loading...</main>;

  return (
    <main className="container detail-layout">
      {product.image ? (
        <img
          className="detail-image"
          src={product.image}
          alt={product.name}
        />
      ) : (
        <div className="image-placeholder">No Image</div>
      )}

      <section>
        <span className="category">{product.category}</span>
        <h1>{product.name}</h1>
        <h2 className="price">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </h2>
        <p>{product.description || "No description available."}</p>
        <p>Available stock: {product.stock}</p>
        <Link to="/" className="btn">Back to Products</Link>
      </section>
    </main>
  );
}