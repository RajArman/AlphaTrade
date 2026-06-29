export default function Team() {
  return (
    <section className="container py-5 mb-5">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <h2 className="fw-bold" style={{ color: "#1f2937" }}>
            Project Developer
          </h2>

          <p className="text-muted fs-5">
            Designed and developed as a full-stack portfolio monitoring project.
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div
            className="p-4 p-md-5 shadow-sm"
            style={{
              borderRadius: "18px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 className="fw-bold mb-3">Arman Raj</h3>

            <p className="text-muted mb-4">
              B.Tech Electronics and Communication Engineering student at BIT
              Mesra. This project was built to gain hands-on experience with
              full-stack development, authentication, database integration, and
              financial dashboard design.
            </p>

            <div className="row g-4">
              <div className="col-md-4">
                <h5 className="fw-semibold">Frontend</h5>
                <p className="text-muted mb-0">
                  React, routing, reusable components, responsive UI.
                </p>
              </div>

              <div className="col-md-4">
                <h5 className="fw-semibold">Backend</h5>
                <p className="text-muted mb-0">
                  Node.js, Express APIs, authentication middleware.
                </p>
              </div>

              <div className="col-md-4">
                <h5 className="fw-semibold">Database</h5>
                <p className="text-muted mb-0">
                  MongoDB schemas for users, holdings, orders, and funds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}