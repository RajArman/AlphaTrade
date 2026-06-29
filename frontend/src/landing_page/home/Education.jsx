export default function Education() {
  return (
    <section className="container py-5 my-5">
      <div className="row align-items-center g-5">

        <div className="col-lg-5 text-center">
          <img
            src="media/images/education.svg"
            alt="Investment Learning"
            className="img-fluid"
            style={{ maxWidth: "450px" }}
          />
        </div>

        <div className="col-lg-1"></div>

        <div className="col-lg-6">

          <h2
            className="fw-bold mb-4"
            style={{
              fontSize: "2.2rem",
              color: "#1f2937",
            }}
          >
            Learn. Analyze. Grow.
          </h2>

          <p
            className="text-muted"
            style={{
              lineHeight: "1.8",
              fontSize: "1.05rem",
            }}
          >
            AlphaTrade is designed not only to help you monitor your
            investments but also to improve your understanding of
            portfolio management and market trends.
          </p>

          <div className="mt-5">

            <h5 className="fw-semibold">
              📚 Portfolio Learning Resources
            </h5>

            <p className="text-muted">
              Learn the fundamentals of investing, portfolio allocation,
              diversification, and long-term wealth creation.
            </p>

            <a
              href=""
              style={{
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Explore Resources{" "}
              <i className="fa-solid fa-arrow-right"></i>
            </a>

          </div>

          <div className="mt-5">

            <h5 className="fw-semibold">
              💬 Community Discussions
            </h5>

            <p className="text-muted">
              Join discussions, exchange investment ideas, and stay
              updated with the latest market insights from fellow
              investors.
            </p>

            <a
              href=""
              style={{
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Visit Community{" "}
              <i className="fa-solid fa-arrow-right"></i>
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}