import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="container mb-5 p-5 mt-5">
      <div className="row text-center p-5">

        <img
          src="media/images/homeHero.svg"
          alt="AlphaTrade Dashboard"
          className="mb-4"
          style={{ width: "65%", margin: "auto" }}
        />

        <h1
          className="mt-5 fw-bold"
          style={{ fontSize: "3rem", color: "#1f2937" }}
        >
          Manage Your Portfolio With Confidence
        </h1>

        <p
          className="mt-3 mb-5"
          style={{
            fontSize: "1.2rem",
            color: "#6b7280",
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          Monitor your investments, track portfolio performance,
          analyze market trends, and make smarter financial decisions
          from one powerful platform.
        </p>

        <div>
          <Link to="/signup">
            <button
              className="btn btn-primary px-5 py-2 fs-5"
              style={{
                borderRadius: "8px",
                backgroundColor: "#2563eb",
                border: "none",
              }}
            >
              Get Started
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}