import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function SignupForm() {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3002/auth/signup",
        { ...inputValue },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message || "Account created successfully", {
          position: "bottom-right",
        });

        setTimeout(() => {
          window.location.href = "http://localhost:5173";
        }, 1000);
      } else {
        toast.error(data.message || "Signup failed", {
          position: "bottom-left",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
        { position: "bottom-left" }
      );
    }

    setInputValue({
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <section className="container pb-5 mb-5">
      <div className="row align-items-center justify-content-center g-5">
        <div className="col-lg-6 text-center">
          <img
            src="media/images/signupimg1.svg"
            className="img-fluid"
            alt="Signup"
            style={{ maxWidth: "480px" }}
          />
        </div>

        <div className="col-lg-5">
          <div
            className="p-4 p-md-5 shadow-sm"
            style={{
              borderRadius: "18px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2 className="fw-bold mb-2" style={{ color: "#1f2937" }}>
              Sign up
            </h2>

            <p className="text-muted mb-4">
              Create your account and access your AlphaTrade dashboard.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={handleOnChange}
                  required
                  style={{ height: "46px" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  className="form-control"
                  type="text"
                  name="username"
                  value={username}
                  placeholder="Choose a username"
                  onChange={handleOnChange}
                  required
                  minLength={3}
                  style={{ height: "46px" }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Create a password"
                  onChange={handleOnChange}
                  required
                  minLength={3}
                  style={{ height: "46px" }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                style={{
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "1rem",
                }}
              >
                Create Account
              </button>

              <p className="text-center mt-4 mb-0">
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
}