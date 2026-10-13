import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { API_URL } from "../config";


function AdminProducts() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const selectedCategory =
    searchParams.get("category");


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // CHECK ADMIN + GET PRODUCTS
  // =====================================================

  useEffect(() => {

    const admin = JSON.parse(
      localStorage.getItem("admin")
    );

    if (!admin || admin.role !== "admin") {

      navigate("/admin-login");

      return;
    }

    fetchProducts();

  }, [navigate]);


  // =====================================================
  // GET PRODUCTS
  // =====================================================

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/products`
      );

      const data = await response.json();


      if (Array.isArray(data)) {

        setProducts(data);

      } else if (
        Array.isArray(data.products)
      ) {

        setProducts(data.products);

      } else {

        setProducts([]);

      }

    } catch (error) {

      console.log(error);

      setProducts([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FILTER PRODUCTS BY CATEGORY
  // =====================================================

  const filteredProducts =
    selectedCategory
      ? products.filter(
          (product) =>
            (
              product.category ||
              "Uncategorized"
            ).trim() ===
            selectedCategory.trim()
        )
      : products;


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );


      const data = await response.json();


      if (response.ok) {

        alert(
          "Product deleted successfully"
        );

        fetchProducts();

      } else {

        alert(
          data.message ||
          "Delete failed"
        );

      }

    } catch (error) {

      console.log(error);

      alert("Server error");

    }

  };


  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const editProduct = (id) => {

    navigate(
      `/edit-product/${id}`
    );

  };


  // =====================================================
  // SHOW ALL PRODUCTS
  // =====================================================

  const showAllProducts = () => {

    navigate("/admin-products");

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-layout">

      <AdminSidebar />


      <main className="admin-main">

        {/* HEADER */}

        <div className="admin-header">

          <div>

            <h1>
              Products
            </h1>

            <p>

              {selectedCategory
                ? `Category: ${selectedCategory} (${filteredProducts.length} products)`
                : `Manage your store products (${products.length})`}

            </p>

          </div>


          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >

            {/* BACK TO ALL */}

            {selectedCategory && (

              <button
                className="primary-btn"
                onClick={showAllProducts}
              >
                ← All Products
              </button>

            )}


            {/* ADD PRODUCT */}

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/add-product")
              }
            >
              + Add Product
            </button>

          </div>

        </div>


        {/* PRODUCTS BOX */}

        <div className="admin-box">

          {loading ? (

            <p>
              Loading products...
            </p>

          ) : filteredProducts.length === 0 ? (

            <div className="empty-box">

              <h3>
                No Products Found
              </h3>

              {selectedCategory ? (

                <button
                  className="primary-btn"
                  onClick={showAllProducts}
                >
                  ← Show All Products
                </button>

              ) : (

                <button
                  className="primary-btn"
                  onClick={() =>
                    navigate("/add-product")
                  }
                >
                  Add First Product
                </button>

              )}

            </div>

          ) : (

            <div className="product-admin-grid">

              {filteredProducts.map(
                (product) => {

                  const productId =
                    product._id ||
                    product.id;


                  return (

                    <div
                      className="admin-product-card"
                      key={productId}
                    >

                      {/* IMAGE */}

                      <div className="admin-product-image">

                        <img
                          src={
                            product.image ||
                            "https://via.placeholder.com/250"
                          }
                          alt={product.name}
                        />

                      </div>


                      {/* INFO */}

                      <div className="admin-product-info">

                        <h3>
                          {product.name}
                        </h3>


                        <p>
                          {product.category ||
                            "No Category"}
                        </p>


                        <h4>
                          ₹{product.price}
                        </h4>


                        <p>
                          Stock: {product.stock}
                        </p>


                        {/* BUTTONS */}

                        <div className="product-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editProduct(
                                productId
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteProduct(
                                productId
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      </main>

    </div>

  );
}

export default AdminProducts; 