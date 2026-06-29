import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom fixed-top shadow-sm"
      style={{ zIndex: 1000 }}
    >
      <div className="container">

        <Link
          className="navbar-brand d-flex align-items-center fw-bold"
          to="/"
          style={{
            fontSize: "1.5rem",
            color: "#2563eb",
            letterSpacing: "0.5px",
          }}
        >
          <i
            className="fa-solid fa-chart-line me-2"
            style={{ color: "#2563eb" }}
          ></i>

          AlphaTrade
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item mx-lg-2">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item mx-lg-2">
              <Link className="nav-link" to="/products">
                Features
              </Link>
            </li>

            <li className="nav-item mx-lg-2">
              <Link className="nav-link" to="/pricing">
                Platform
              </Link>
            </li>

            <li className="nav-item mx-lg-2">
              <Link className="nav-link" to="/support">
                Contact
              </Link>
            </li>

            <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
              <Link
                to="/signup"
                className="btn btn-primary px-4"
                style={{
                  borderRadius: "8px",
                  fontWeight: "600",
                }}
              >
                Get Started
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}