export default function Hero() {
  return (
    <section className="container py-5 mt-5">
      <div className="row justify-content-center text-center py-5">
        <div className="col-lg-9">
          <h1 className="fw-bold mb-4" style={{ color: "#1f2937" }}>
            Built to Make Portfolio Monitoring Simpler
          </h1>

          <p className="text-muted fs-5" style={{ lineHeight: "1.8" }}>
            AlphaTrade is a full-stack stock monitoring platform designed to
            help users track holdings, manage orders, view funds, and understand
            their investment performance through a clean dashboard.
          </p>
        </div>
      </div>

      <div className="row g-5 border-top pt-5">
        <div className="col-lg-6">
          <h3 className="fw-bold mb-3">Our Purpose</h3>

          <p className="text-muted" style={{ lineHeight: "1.8" }}>
            The goal of AlphaTrade is to provide a centralized platform where
            users can monitor their portfolio information without switching
            between multiple tools.
          </p>

          <p className="text-muted" style={{ lineHeight: "1.8" }}>
            The application combines authentication, protected dashboards,
            portfolio tracking, holdings management, orders, and fund monitoring
            into one organized interface.
          </p>
        </div>

        <div className="col-lg-6">
          <h3 className="fw-bold mb-3">How It Works</h3>

          <p className="text-muted" style={{ lineHeight: "1.8" }}>
            AlphaTrade is built using React, Node.js, Express, MongoDB, and JWT
            authentication. The frontend communicates with secure REST APIs,
            while MongoDB stores user and portfolio-related data.
          </p>

          <p className="text-muted" style={{ lineHeight: "1.8" }}>
            This modular architecture keeps the frontend, backend, and dashboard
            separated, making the platform easier to maintain and extend.
          </p>
        </div>
      </div>
    </section>
  );
}