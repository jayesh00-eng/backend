import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Registration Successful");

      navigate("/");

    } catch (error) {

      console.log(error);
      alert("Server error");

    }
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h1>E-Cart Nova</h1>

        <h2>Customer Register</h2>

        <form
          onSubmit={handleRegister}
          autoComplete="off"
        >

          <input
            type="text"
            name="register-name"
            placeholder="Enter Name"
            value={user.name}
            onChange={(e) =>
              setUser({
                ...user,
                name: e.target.value
              })
            }
            autoComplete="off"
            required
          />

          <input
            type="email"
            name="register-email"
            placeholder="Enter Email"
            value={user.email}
            onChange={(e) =>
              setUser({
                ...user,
                email: e.target.value
              })
            }
            autoComplete="off"
            required
          />

          <input
            type="password"
            name="register-password"
            placeholder="Enter Password"
            value={user.password}
            onChange={(e) =>
              setUser({
                ...user,
                password: e.target.value
              })
            }
            autoComplete="new-password"
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?
          <Link to="/"> Login</Link>
        </p>

      </div>

    </div>

  );
}

export default Register;