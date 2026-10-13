import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, formatMoney } from "../config";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  };

  const refreshCount = () => {
    setCartCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
  };

  useEffect(() => {
    // Login check - customer login ke bina products nahi dikhte
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user._id) {
      navigate("/");
      return;
    }

    refreshCount();

    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setError("Products load nahi ho paye. Backend chal raha hai ya nahi check karein.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  };

  const addToCart = (product) => {
    const cart = readCart();
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        showMessage(`Only ${product.stock} available in stock`);
        return;
      }
      existing.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCount();
    showMessage(`${product.name} added to cart`);
  };

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const visibleProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>

        <button className="cart-btn" onClick={() => navigate("/cart")}>
          🛒 Cart ({cartCount})
        </button>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="products-message">Loading products...</p>}

      {!loading && error && <p className="products-message error">{error}</p>}

      {!loading && !error && visibleProducts.length === 0 && (
        <p className="products-message">Koi product nahi mila.</p>
      )}

      <div className="products-grid">
        {visibleProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="product-image-box">
              <img src={product.image} alt={product.name} />
            </div>

            <h3>{product.name}</h3>

            <p className="product-category">{product.category}</p>

            <p className="product-desc">{product.description}</p>

            <div className="product-price">{formatMoney(product.price)}</div>

            {product.stock > 0 ? (
              <span className="stock-badge in">
                {product.stock <= 5 ? `Only ${product.stock} left` : "In Stock"}
              </span>
            ) : (
              <span className="stock-badge out">Out of Stock</span>
            )}

            <div className="product-buttons">
              <button
                disabled={product.stock <= 0}
                onClick={() => addToCart(product)}
              >
                {product.stock > 0 ? "Add to Cart" : "Unavailable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {message && <div className="toast">{message}</div>}
    </div>
  );
}

export default Products;