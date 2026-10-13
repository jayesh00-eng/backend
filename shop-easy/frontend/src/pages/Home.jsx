import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import { getProducts } from "../services/productService";

const initialFilters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  page: 1,
  limit: 8,
};

export default function Home() {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState({
    products: [],
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts(filters);
        setData(response.data);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError(
            err.response?.data?.message ||
              "Unable to load products. Check backend and MongoDB."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters]);

  const changePage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container">
      <section className="hero">
        <p className="hero-tag">WELCOME TO SHOP EASY</p>
        <h1>Find Your Favourite Products</h1>
        <p>Discover products at prices you'll love.</p>
      </section>

      <div className="shop-layout">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
        />

        <section className="product-section">
          <div className="section-heading">
            <div>
              <h2>Our Products</h2>
              <p>{data.totalProducts} products found</p>
            </div>

            <select
              value={filters.limit}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  limit: Number(e.target.value),
                  page: 1,
                }))
              }
            >
              <option value={8}>8 per page</option>
              <option value={12}>12 per page</option>
              <option value={16}>16 per page</option>
            </select>
          </div>

          {loading && <p>Loading products...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && data.products.length === 0 && (
            <p>No products found. Try changing your filters.</p>
          )}

          {!loading && !error && (
            <>
              <div className="product-grid">
                {data.products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>

              <Pagination
                page={data.currentPage}
                totalPages={data.totalPages}
                onPageChange={changePage}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}