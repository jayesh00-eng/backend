import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerHome() {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const slides = [
    {
      title: "Big Shopping Sale",
      text: "Up to 50% OFF on selected products",
      button: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db"
    },
    {
      title: "Latest Smartphones",
      text: "Discover the latest mobiles at amazing prices",
      button: "Explore Mobiles",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
    },
    {
      title: "Laptop Collection",
      text: "Powerful laptops for work, study and gaming",
      button: "View Laptops",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
    },
    {
      title: "Fashion Collection",
      text: "Trending fashion at special prices",
      button: "Shop Fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="home">

      {/* ================= BANNER ================= */}

      <div className="home-banner">

        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
        />

        <div className="banner-overlay">
          <h1>{slides[currentSlide].title}</h1>

          <p>{slides[currentSlide].text}</p>

          <button
            onClick={() => navigate("/products")}
          >
            {slides[currentSlide].button}
          </button>
        </div>

        <button
          className="slider-btn prev"
          onClick={previousSlide}
        >
          ❮
        </button>

        <button
          className="slider-btn next"
          onClick={nextSlide}
        >
          ❯
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={
                currentSlide === index
                  ? "dot active"
                  : "dot"
              }
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>

      </div>


      {/* ================= WELCOME ================= */}

      <div className="home-content">

        <h1>Welcome to E-Cart Nova</h1>

        <h2>
          Hello, {user.name || "Customer"} 👋
        </h2>

        <p>
          Discover amazing products at the best prices.
        </p>

        <button
          onClick={() => navigate("/products")}
        >
          View All Products
        </button>

        <button
          onClick={() => navigate("/cart")}
        >
          🛒 View Cart
        </button>

        <button
          onClick={() => navigate("/orders")}
        >
          My Orders
        </button>

      </div>

    </div>
  );
}

export default CustomerHome;