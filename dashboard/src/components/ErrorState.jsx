const ErrorState = ({ message = "Please refresh the page or try again shortly." }) => {
  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <h3 style={{ color: "#e53935", marginBottom: "8px" }}>
        Couldn't load your data
      </h3>
      <p style={{ color: "#777" }}>{message}</p>
    </div>
  );
};

export default ErrorState;
