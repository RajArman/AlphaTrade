export default function Pricing() {
  return (
    <section className="container py-5 my-5">
      <div className="row align-items-center g-5">

        <div className="col-lg-5">
          <h2
            className="fw-bold mb-4"
            style={{
              fontSize: "2.2rem",
              color: "#1f2937",
            }}
          >
            Simple. Secure. Powerful.
          </h2>

          <p
            className="text-muted mb-4"
            style={{
              fontSize: "1.05rem",
              lineHeight: "1.8",
            }}
          >
            AlphaTrade helps you monitor investments, manage holdings,
            and understand your portfolio through a clean and intuitive
            dashboard designed for everyday investors.
          </p>

          <a
            href=""
            style={{
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Explore Dashboard{" "}
            <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>

        <div className="col-lg-7">

          <div className="row text-center g-4">

            <div className="col-md-4">
              <img
                src="media/images/pricing0.svg"
                alt="Authentication"
                className="img-fluid"
                style={{ maxWidth: "90px" }}
              />
              <h6 className="mt-3 fw-semibold">
                Secure Authentication
              </h6>
            </div>

            <div className="col-md-4">
              <img
                src="media/images/pricing0.svg"
                alt="Portfolio"
                className="img-fluid"
                style={{ maxWidth: "90px" }}
              />
              <h6 className="mt-3 fw-semibold">
                Portfolio Tracking
              </h6>
            </div>

            <div className="col-md-4">
              <img
                src="media/images/pricing20.svg"
                alt="Analytics"
                className="img-fluid"
                style={{ maxWidth: "90px" }}
              />
              <h6 className="mt-3 fw-semibold">
                Investment Analytics
              </h6>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}