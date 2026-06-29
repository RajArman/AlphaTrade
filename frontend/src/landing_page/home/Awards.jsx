export default function Awards() {
  return (
    <section className="container py-5 my-5">
      <div className="row align-items-center g-5">

        <div className="col-lg-6 text-center">
          <img
            src="media/images/largestBroker.svg"
            alt="Portfolio Dashboard"
            className="img-fluid"
            style={{ maxWidth: "480px" }}
          />
        </div>

        <div className="col-lg-6">

          <h2
            className="fw-bold mb-4"
            style={{
              fontSize: "2.2rem",
              color: "#1f2937",
            }}
          >
            Everything You Need to Track Your Investments
          </h2>

          <p
            className="text-muted mb-5"
            style={{
              lineHeight: "1.8",
              fontSize: "1.05rem",
            }}
          >
            AlphaTrade brings together portfolio tracking, holdings,
            fund management and investment analytics into one simple,
            secure dashboard built for modern investors.
          </p>

          <div className="row">

            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-3">📊 Portfolio Dashboard</li>
                <li className="mb-3">📈 Holdings Management</li>
                <li className="mb-3">📝 Order Tracking</li>
              </ul>
            </div>

            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-3">💰 Fund Management</li>
                <li className="mb-3">📉 Performance Analytics</li>
                <li className="mb-3">🔒 Secure Authentication</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}