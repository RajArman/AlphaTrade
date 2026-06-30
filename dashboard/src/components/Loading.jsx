const Loading = () => {
  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "45px",
          height: "45px",
          border: "5px solid #e5e7eb",
          borderTop: "5px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <p
        style={{
          marginTop: "18px",
          color: "#777",
        }}
      >
        Loading Portfolio...
      </p>
    </div>
  );
};

export default Loading;