import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {

  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQuantity = (id) => {

    const newCart = cart.map((item) => {

      if (item._id === id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    updateCart(newCart);
  };

  const decreaseQuantity = (id) => {

    const newCart = cart
      .map((item) => {

        if (item._id === id) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    updateCart(newCart);
  };

  const removeItem = (id) => {

    const newCart = cart.filter(
      (item) => item._id !== id
    );

    updateCart(newCart);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">

      <h1>🛒 Shopping Cart</h1>

      {cart.length === 0 ? (

        <div className="empty-cart">
          <h2>Your cart is empty</h2>

          <button
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>

      ) : (

        <>
          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item._id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-info">

                  <h2>{item.name}</h2>

                  <p>
                    ₹{item.price}
                  </p>

                  <div className="quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(item._id)
                      }
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item._id)
                      }
                    >
                      +
                    </button>

                  </div>

                  <p>
                    Subtotal: ₹
                    {item.price * item.quantity}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item._id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

          <div className="cart-summary">

            <h2>
              Total: ₹{total}
            </h2>

            <button
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
            </button>

          </div>

        </>

      )}

    </div>
  );
}

export default Cart;