import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { API_URL, formatMoney } from "../config";

const PAYMENT_OPTIONS = [

  { id: "COD", icon: "💵", title: "Cash on Delivery", text: "Pay when your order arrives" },

  { id: "UPI", icon: "📱", title: "UPI", text: "Google Pay, PhonePe, Paytm" },

  { id: "Card", icon: "💳", title: "Credit / Debit Card", text: "Visa, Mastercard, RuPay" },

];

function Checkout() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [payment, setPayment] = useState("COD");

  const [upiId, setUpiId] = useState("");

  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const [placing, setPlacing] = useState(false);

  useEffect(() => {

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);

    const savedUser = JSON.parse(localStorage.getItem("user")) || {};

    setName(savedUser.name || "");

  }, []);

  const total = cart.reduce(

    (sum, item) => sum + Number(item.price) * Number(item.quantity),

    0

  );

  // ---------- Card input formatting ----------

  const handleCardChange = (e) => {

    const { name: field, value } = e.target;

    let v = value;

    if (field === "number") {

      v = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

    }

    if (field === "expiry") {

      const digits = value.replace(/\D/g, "").slice(0, 4);

      v = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;

    }

    if (field === "cvv") {

      v = value.replace(/\D/g, "").slice(0, 3);

    }

    setCard({ ...card, [field]: v });

  };

  // ---------- Validation ----------

  const validate = () => {

    if (cart.length === 0) return "Your cart is empty";

    if (!name.trim() || !address.trim() || !phone.trim())

      return "Please enter name, address and phone number";

    if (!/^\d{10}$/.test(phone.trim()))

      return "Phone number must be 10 digits";

    if (payment === "UPI" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim()))

      return "Enter a valid UPI ID (example: name@upi)";

    if (payment === "Card") {

      if (card.number.replace(/\s/g, "").length !== 16)

        return "Card number must be 16 digits";

      if (!card.name.trim()) return "Enter the name on the card";

      const [mm, yy] = card.expiry.split("/");

      if (!mm || !yy || yy.length !== 2 || Number(mm) < 1 || Number(mm) > 12)

        return "Enter card expiry as MM/YY";

      if (card.cvv.length !== 3) return "CVV must be 3 digits";

    }

    return "";

  };

  // ---------- Place order ----------

  const placeOrder = async () => {

    const problem = validate();

    if (problem) {

      alert(problem);

      return;

    }

    const user = JSON.parse(localStorage.getItem("user")) || {};

    if (!user._id) {

      alert("Please login first");

      navigate("/");

      return;

    }

    // Card / UPI details server ko NAHI bhejte - sirf payment method jata hai

    const orderData = {

      customer: user._id,

      items: cart.map((item) => ({

        product: item._id,

        name: item.name,

        price: Number(item.price),

        quantity: Number(item.quantity),

        image: item.image,

      })),

      totalAmount: total,

      address: { name, phone, address },

      paymentMethod: payment,

    };

    try {

      setPlacing(true);

      const response = await fetch(`${API_URL}/api/orders`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(orderData),

      });

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Order failed");

        return;

      }

      localStorage.removeItem("cart");

      alert(

        payment === "COD"

          ? "Order placed successfully! Pay on delivery."

          : "Payment successful! Order placed."

      );

      navigate("/orders");

    } catch (error) {

      console.log(error);

      alert("Server error");

    } finally {

      setPlacing(false);

    }

  };

  const buttonText = placing

    ? "Placing order..."

    : payment === "COD"

    ? `🛍️ Place Order • ${formatMoney(total)}`

    : `🔒 Pay ${formatMoney(total)}`;

  return (

    <div className="checkout-container wide">

      <h1>Checkout</h1>

      <div className="checkout-layout">

        {/* LEFT: details + payment */}

        <div className="checkout-box">

          <h2>Delivery Details</h2>

          <input

            type="text"

            placeholder="Full Name"

            value={name}

            onChange={(e) => setName(e.target.value)}

          />

          <input

            type="tel"

            placeholder="Phone Number (10 digits)"

            value={phone}

            maxLength={10}

            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}

          />

          <input

            type="text"

            placeholder="Full Address"

            value={address}

            onChange={(e) => setAddress(e.target.value)}

          />

          <h2>Payment Method</h2>

          <div className="payment-options">

            {PAYMENT_OPTIONS.map((option) => (

              <label

                key={option.id}

                className={

                  payment === option.id ? "payment-option selected" : "payment-option"

                }

              >

                <input

                  type="radio"

                  name="payment"

                  value={option.id}

                  checked={payment === option.id}

                  onChange={() => setPayment(option.id)}

                />

                <span className="payment-icon">{option.icon}</span>

                <span className="payment-text">

                  <strong>{option.title}</strong>

                  <small>{option.text}</small>

                </span>

              </label>

            ))}

          </div>

          {payment === "UPI" && (

            <div className="payment-details">

              <input

                type="text"

                placeholder="Enter UPI ID (example: name@upi)"

                value={upiId}

                onChange={(e) => setUpiId(e.target.value)}

              />

            </div>

          )}

          {payment === "Card" && (

            <div className="payment-details">

              <input

                type="text"

                name="number"

                placeholder="Card Number"

                inputMode="numeric"

                value={card.number}

                onChange={handleCardChange}

              />

              <input

                type="text"

                name="name"

                placeholder="Name on Card"

                value={card.name}

                onChange={handleCardChange}

              />

              <div className="card-row">

                <input

                  type="text"

                  name="expiry"

                  placeholder="MM/YY"

                  inputMode="numeric"

                  value={card.expiry}

                  onChange={handleCardChange}

                />

                <input

                  type="password"

                  name="cvv"

                  placeholder="CVV"

                  inputMode="numeric"

                  autoComplete="off"

                  value={card.cvv}

                  onChange={handleCardChange}

                />

              </div>

            </div>

          )}

          {payment !== "COD" && (

            <p className="payment-note">

              🔒 Demo payment for this project - no real money is charged and card

              details are never saved.

            </p>

          )}

        </div>

        {/* RIGHT: order summary */}

        <div className="checkout-box summary-box">

          <h2>Order Summary</h2>

          {cart.length === 0 ? (

            <p className="summary-empty">Your cart is empty.</p>

          ) : (

            cart.map((item) => (

              <div className="summary-item" key={item._id}>

                <span>

                  {item.name} × {item.quantity}

                </span>

                <span>{formatMoney(item.price * item.quantity)}</span>

              </div>

            ))

          )}

          <div className="summary-total">

            <span>Total</span>

            <span>{formatMoney(total)}</span>

          </div>

          <button onClick={placeOrder} disabled={placing || cart.length === 0}>

            {buttonText}

          </button>

        </div>

      </div>

    </div>

  );

}

export default Checkout; 