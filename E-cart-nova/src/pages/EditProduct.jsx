import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);


  // =====================================================
  // GET SINGLE PRODUCT
  // =====================================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {

          alert(
            data.message ||
            "Product not found"
          );

          navigate("/admin-products");

          return;
        }

        setProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          image: data.image || "",
          stock: data.stock || "",
        });

      } catch (error) {

        console.log(error);

        alert("Server error");

        navigate("/admin-products");

      } finally {

        setLoading(false);

      }
    };


    if (id) {
      fetchProduct();
    }

  }, [id, navigate]);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });

  };


  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setUpdating(true);

    try {

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: product.name,
            description: product.description,
            price: Number(product.price),
            category: product.category,
            image: product.image,
            stock: Number(product.stock),
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Product update failed"
        );

        return;
      }


      alert(
        "Product Updated Successfully"
      );


      // Go back to admin products
      navigate("/admin-products");


    } catch (error) {

      console.log(error);

      alert("Server error");

    } finally {

      setUpdating(false);

    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="form-container">

        <h2>
          Loading Product...
        </h2>

      </div>
    );

  }


  // =====================================================
  // EDIT FORM
  // =====================================================

  return (

    <div className="form-container">

      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit}>

        {/* PRODUCT NAME */}

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />


        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          required
        />


        {/* PRICE */}

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />


        {/* CATEGORY */}

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          required
        />


        {/* IMAGE */}

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={product.image}
          onChange={handleChange}
          required
        />


        {/* STOCK */}

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          required
        />


        {/* UPDATE */}

        <button
          type="submit"
          disabled={updating}
        >
          {updating
            ? "Updating..."
            : "Update Product"}
        </button>


        {/* CANCEL */}

        <button
          type="button"
          onClick={() =>
            navigate("/admin-products")
          }
        >
          Cancel
        </button>

      </form>

    </div>

  );
}

export default EditProduct;