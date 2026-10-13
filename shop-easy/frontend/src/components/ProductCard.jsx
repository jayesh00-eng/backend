
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  // Product nahi mila toh component render nahi hoga
  if (!product) {
    return null;
  }

  return (
    <div className="product-card">
      {product._id ? (
        <Link to={`/product/${product._id}`}>
          {product.image ? (
            <img
              className="product-image"
              src={product.image}
              alt={product.name || "Product"}
            />
          ) : (
            <div className="image-placeholder">
              No Image
            </div>
          )}
        </Link>
      ) : (
        <div className="image-placeholder">
          No Image
        </div>
      )}

      <div className="product-info">
        <span className="category">
          {product.category || "Uncategorized"}
        </span>

        <h3>{product.name || "Unnamed Product"}</h3>

        <p className="price">
          ₹{Number(product.price ?? 0).toLocaleString("en-IN")}
        </p>

        <p>Stock: {product.stock ?? 0}</p>

        {product._id && (
          <Link
            to={`/product/${product._id}`}
            className="btn"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
