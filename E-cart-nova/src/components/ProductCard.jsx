import { Link } from "react-router-dom";

function ProductCard({ product, deleteProduct }) {
  return (
    <div className="product-card">

      <img
        src={product.image}
        alt={product.name}
      />

      <h3>{product.name}</h3>

      <p>{product.description}</p>

      <h3>₹{product.price}</h3>

      <p>
        Category: {product.category}
      </p>

      <p>
        Stock: {product.stock}
      </p>

      <div className="product-buttons">

        <Link to={`/edit-product/${product._id}`}>
          <button>
            Edit
          </button>
        </Link>

        <button
          onClick={() => deleteProduct(product._id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default ProductCard;