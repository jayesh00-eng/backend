import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      <h1>Welcome to E-Cart Nova</h1>

      <p>
        Online Shopping Management System
      </p>

      <Link to="/products">
        <button>
          View Products
        </button>
      </Link>

    </div>
  );
}

export default Home;