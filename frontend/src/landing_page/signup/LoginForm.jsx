import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import HeroForLogin from "./HeroForLogin";

export default function LoginForm() {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

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
        "https://alpha-trade-iota.vercel.app/auth/login",
        { ...inputValue },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message || "Logged in successfully", {
          position: "bottom-right",
        });

        setTimeout(() => {
          window.location.replace("https://alpha-trade-hbbt.vercel.app");
        }, 1000);
      } else {
        toast.error(data.message || "Login failed", {
          position: "bottom-left",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
        { position: "bottom-left" }
      );
    }

    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <HeroForLogin />

      <section className="container pb-5 mb-5">
        <div className="row align-items-center justify-content-center g-5">
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
                Login
              </h2>

              <p className="text-muted mb-4">
                Access your AlphaTrade dashboard and continue tracking your
                portfolio.
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

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Enter your password"
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
                  Login
                </button>

                <p className="text-center mt-4 mb-0">
                  Don't have an account?{" "}
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <div className="col-lg-6 text-center">
            <img
              src="/media/images/kite.svg"
              className="img-fluid"
              alt="Dashboard"
              style={{ maxWidth: "500px" }}
            />
          </div>
        </div>

        <ToastContainer />
      </section>
    </>
  );
}