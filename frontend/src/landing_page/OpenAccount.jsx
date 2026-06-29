import { Link } from "react-router-dom";

export default function OpenAccount() {
  return (
    <section className="container py-5 my-5">
      <div className="row justify-content-center text-center">

        <div className="col-lg-8">

          <h2
            className="fw-bold mb-4"
            style={{
              fontSize: "2.4rem",
              color: "#1f2937",
            }}
          >
            Ready to Take Control of Your Investments?
          </h2>

          <p
            className="text-muted mb-5"
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
            }}
          >
            Join AlphaTrade and manage your portfolio through a secure,
            intuitive platform designed for smarter investing and
            long-term financial growth.
          </p>

          <Link to="/signup">
            <button
              className="btn btn-primary px-5 py-3"
              style={{
                borderRadius: "10px",
                fontSize: "1.05rem",
                fontWeight: "600",
              }}
            >
              Create Free Account
            </button>
          </Link>

        </div>

      </div>
    </section>
  );
}