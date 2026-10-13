import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AdminInventory() {

  const [products, setProducts] = useState([]);


  useEffect(() => {

    fetchProducts();

  }, []);


  const fetchProducts = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      }

    } catch (error) {

      console.log(error);

    }

  };


  const getStockStatus = (stock) => {

    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 5) {
      return "Low Stock";
    }

    return "In Stock";
  };


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main">

        <div className="admin-header">

          <div>
            <h1>Inventory</h1>
            <p>Manage product stock</p>
          </div>

        </div>


        <div className="inventory-summary">

          <div className="inventory-card">
            <h3>Total Products</h3>
            <h2>{products.length}</h2>
          </div>

          <div className="inventory-card">
            <h3>Low Stock</h3>

            <h2>
              {
                products.filter(
                  (p) =>
                    Number(p.stock) > 0 &&
                    Number(p.stock) <= 5
                ).length
              }
            </h2>

          </div>

          <div className="inventory-card">
            <h3>Out of Stock</h3>

            <h2>
              {
                products.filter(
                  (p) =>
                    Number(p.stock) === 0
                ).length
              }
            </h2>

          </div>

        </div>


        <div className="admin-box">

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {products.map((product) => {

                  const stock = Number(
                    product.stock || 0
                  );

                  return (

                    <tr
                      key={
                        product._id ||
                        product.id
                      }
                    >

                      <td>
                        {product.name}
                      </td>

                      <td>
                        {product.category}
                      </td>

                      <td>
                        ₹{product.price}
                      </td>

                      <td>
                        {stock}
                      </td>

                      <td>

                        <span
                          className={`status ${
                            stock === 0
                              ? "cancelled"
                              : stock <= 5
                              ? "pending"
                              : "delivered"
                          }`}
                        >
                          {getStockStatus(stock)}
                        </span>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminInventory;