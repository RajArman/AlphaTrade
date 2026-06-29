export default function LeftSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <section className="container py-5">
      <div className="row align-items-center g-5">
        <div className="col-lg-7 text-center">
          <img
            src={imageURL}
            className="img-fluid"
            alt={productName}
            style={{ maxWidth: "620px" }}
          />
        </div>

        <div className="col-lg-5">
          <h2 className="fw-bold mb-4" style={{ color: "#1f2937" }}>
            {productName}
          </h2>

          <p
            className="text-muted mb-4"
            style={{ fontSize: "1.05rem", lineHeight: "1.8" }}
          >
            {productDescription}
          </p>

          <a
            href={learnMore || ""}
            style={{ textDecoration: "none", fontWeight: "600" }}
          >
            Learn More <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}