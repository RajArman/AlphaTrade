import { Link } from "react-router-dom";

export default function Universe() {
  const features = [
    {
      icon: "📊",
      title: "Portfolio Overview",
      desc: "View investment value, available funds, holdings, and activity from a single dashboard.",
    },
    {
      icon: "📈",
      title: "Holdings Analysis",
      desc: "Track quantities, average price, current value, and profit or loss for each holding.",
    },
    {
      icon: "📝",
      title: "Order Monitoring",
      desc: "Review transaction history and monitor all placed orders in a structured format.",
    },
    {
      icon: "💰",
      title: "Funds Management",
      desc: "Check available margin, used margin, opening balance, and fund details clearly.",
    },
    {
      icon: "🔒",
      title: "Protected Dashboard",
      desc: "JWT authentication ensures only verified users can access sensitive dashboard modules.",
    },
    {
      icon: "🤖",
      title: "Portfolio Insights",
      desc: "Designed to support future AI-powered insights for understanding portfolio health.",
    },
  ];

  return (
    <section className="container py-5 my-5">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-3" style={{ color: "#1f2937" }}>
            Built Around Your Portfolio
          </h2>

          <p className="text-muted fs-5">
            AlphaTrade brings together the core tools needed to monitor and
            understand investment activity.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {features.map((feature) => (
          <div className="col-lg-4 col-md-6" key={feature.title}>
            <div
              className="h-100 p-4 shadow-sm"
              style={{
                borderRadius: "18px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
              }}
            >
              <div style={{ fontSize: "2rem" }} className="mb-3">
                {feature.icon}
              </div>

              <h5 className="fw-bold mb-3">{feature.title}</h5>

              <p className="text-muted mb-0" style={{ lineHeight: "1.7" }}>
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <Link
          to="/signup"
          className="btn btn-primary px-5 py-3"
          style={{
            borderRadius: "10px",
            fontWeight: "600",
          }}
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}