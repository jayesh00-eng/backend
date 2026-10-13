import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

// Categories products se automatically banti hain
function AdminCategories() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();


  // =====================================================
  // GET PRODUCTS
  // =====================================================

  useEffect(() => {

    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }

      })
      .catch((error) => {
        console.log(error);
      });

  }, []);


  // =====================================================
  // CATEGORY COUNT
  // =====================================================

  const counts = products.reduce((acc, p) => {

    const name =
      (p.category || "Uncategorized").trim();

    acc[name] =
      (acc[name] || 0) + 1;

    return acc;

  }, {});


  const categories = Object.entries(counts);


  // =====================================================
  // OPEN CATEGORY PRODUCTS
  // =====================================================

  const openCategory = (categoryName) => {

    navigate(
      `/admin-products?category=${encodeURIComponent(
        categoryName
      )}`
    );

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
              Categories
            </h1>

            <p>
              Product categories ({categories.length})
            </p>

          </div>

        </div>


        {/* CATEGORY BOX */}

        <div className="admin-box">

          <h2>
            All Categories
          </h2>


          {categories.length === 0 ? (

            <p>
              Koi category nahi hai.
              Pehle product add karein.
            </p>

          ) : (

            <div className="category-grid">

              {categories.map(
                ([name, count]) => (

                  <div
                    className="category-card"
                    key={name}
                    onClick={() =>
                      openCategory(name)
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >

                    <h3>
                      📁 {name}
                    </h3>

                    <span className="status delivered">
                      {count} products
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </main>

    </div>

  );
}

export default AdminCategories;