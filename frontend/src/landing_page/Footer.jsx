import "./Footer.css";

export default function Footer() {
  return (
    <footer
      className="border-top"
      style={{
        backgroundColor: "#f8fafc",
      }}
    >
      <div className="container py-5">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <h3
              className="fw-bold mb-3"
              style={{
                fontSize: "1.6rem",
                color: "#2563eb",
              }}
            >
              <i className="fa-solid fa-chart-line me-2"></i>
              AlphaTrade
            </h3>

            <p
              className="text-muted"
              style={{
                lineHeight: "1.8",
                maxWidth: "360px",
              }}
            >
              A modern portfolio monitoring platform built to help users track
              holdings, manage funds, review orders, and understand investment
              performance through a clean dashboard.
            </p>

            <div className="d-flex gap-3 fs-5 mt-4">
              <i className="fa-brands fa-linkedin"></i>
              <i className="fa-brands fa-github"></i>
              <i className="fa-brands fa-x-twitter"></i>
              <i className="fa-brands fa-instagram"></i>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Platform</h6>
            <ul className="list-unstyled footer-list">
              <li><a href="">Dashboard</a></li>
              <li><a href="">Holdings</a></li>
              <li><a href="">Orders</a></li>
              <li><a href="">Funds</a></li>
              <li><a href="">Portfolio</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Resources</h6>
            <ul className="list-unstyled footer-list">
              <li><a href="">Investment Guide</a></li>
              <li><a href="">Market Insights</a></li>
              <li><a href="">FAQs</a></li>
              <li><a href="">Support</a></li>
              <li><a href="">Documentation</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled footer-list">
              <li><a href="">About</a></li>
              <li><a href="">Features</a></li>
              <li><a href="">Privacy</a></li>
              <li><a href="">Terms</a></li>
              <li><a href="">Contact</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Account</h6>
            <ul className="list-unstyled footer-list">
              <li><a href="">Create Account</a></li>
              <li><a href="">Login</a></li>
              <li><a href="">Security</a></li>
              <li><a href="">Help Center</a></li>
            </ul>
          </div>
        </div>

        <hr className="my-5" />

        <div
          className="text-muted"
          style={{
            fontSize: "0.82rem",
            lineHeight: "1.7",
          }}
        >
          <p>
            AlphaTrade is a full-stack stock monitoring platform created for
            portfolio tracking, holdings management, order monitoring, and fund
            overview. The platform is intended for educational and project
            demonstration purposes.
          </p>

          <p>
            Investments in securities markets are subject to market risks.
            Users should review all relevant financial information carefully
            before making investment decisions.
          </p>

          <p className="mb-0">
            © 2026 AlphaTrade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}