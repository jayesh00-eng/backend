import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET CUSTOMER ORDERS
  // =========================

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const user =
      JSON.parse(localStorage.getItem("user")) || {};

    if (!user._id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/customer/${user._id}`
      );

      const data = await response.json();

      setOrders(
        Array.isArray(data) ? data : []
      );

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/cancel/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Order cancelled successfully!");

        // Orders refresh
        await fetchOrders();
      } else {
        alert(
          data.message ||
            "Failed to cancel order"
        );
      }
    } catch (error) {
      console.log(error);

      alert(
        "Something went wrong while cancelling order"
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        Loading Orders...
      </h2>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div
      className="orders-container"
      style={{
        padding: "30px",
        backgroundColor: "#f4f6fb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          <h2>No Orders Found</h2>

          <p>
            You have not placed any order yet.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            className="order-card"
            key={order._id}
            style={{
              maxWidth: "1000px",
              margin: "0 auto 25px",
              backgroundColor: "white",
              padding: "28px",
              borderRadius: "15px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.08)",
            }}
          >
            {/* ORDER ID */}

            <h2>
              Order ID: {order._id}
            </h2>

            {/* STATUS */}

            <p>
              <strong>Status:</strong>{" "}

              <span
                style={{
                  color:
                    order.status === "Cancelled"
                      ? "red"
                      : order.status === "Delivered"
                      ? "green"
                      : "#ff9800",

                  fontWeight: "bold",
                }}
              >
                {order.status}
              </span>
            </p>

            {/* PAYMENT */}

            <p>
              <strong>Payment:</strong>{" "}
              {order.paymentMethod || "COD"}
            </p>

            {/* CUSTOMER */}

            <p>
              <strong>
                Customer Name:
              </strong>{" "}
              {order.address?.name ||
                "Customer"}
            </p>

            {/* PHONE */}

            <p>
              <strong>Phone:</strong>{" "}
              {order.address?.phone || "-"}
            </p>

            {/* ADDRESS */}

            <p>
              <strong>Address:</strong>{" "}
              {order.address?.address || "-"}
            </p>

            <hr />

            {/* PRODUCTS */}

            <h3>Products</h3>

            {order.items?.map(
              (item, index) => (
                <div
                  key={
                    item.product || index
                  }
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                    marginTop: "15px",
                    padding: "10px 0",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border:
                        "1px solid #ddd",
                    }}
                  />

                  <div>
                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Price: ₹{item.price}
                    </p>

                    <p>
                      Quantity:{" "}
                      {item.quantity}
                    </p>

                    <p>
                      Subtotal: ₹
                      {Number(item.price) *
                        Number(
                          item.quantity
                        )}
                    </p>
                  </div>
                </div>
              )
            )}

            <hr />

            {/* TOTAL */}

            <h2
              style={{
                textAlign: "right",
              }}
            >
              Total Amount: ₹
              {order.totalAmount}
            </h2>

            {/* =========================
                CANCEL ORDER BUTTON
            ========================= */}

            {order.status !== "Cancelled" &&
              order.status !== "Delivered" && (
                <div
                  style={{
                    textAlign: "right",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={() =>
                      cancelOrder(
                        order._id
                      )
                    }
                    style={{
                      backgroundColor:
                        "#dc3545",
                      color: "white",
                      border: "none",
                      padding:
                        "12px 28px",
                      borderRadius:
                        "7px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Cancel Order
                  </button>
                </div>
              )}

            {/* =========================
                CANCELLED MESSAGE
            ========================= */}

            {order.status === "Cancelled" && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor:
                    "#ffe5e5",
                  color: "#dc3545",
                  borderRadius: "7px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                ❌ This order has been
                cancelled.
              </div>
            )}

            {/* =========================
                DELIVERED MESSAGE
            ========================= */}

            {order.status === "Delivered" && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor:
                    "#e8f5e9",
                  color: "green",
                  borderRadius: "7px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                ✓ Order Delivered
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;