const Funds = () => {
  const availableMargin = 4043.1;
  const usedMargin = 3757.3;
  const availableCash = 4043.1;

  return (
    <>
      <div className="funds">
        <h3 style={{ marginBottom: "8px" }}>Funds</h3>

        <p style={{ color: "#777", marginBottom: "20px" }}>
          Manage your trading balance and available funds.
        </p>

        <button className="btn btn-green">Add Funds</button>

        <button
          className="btn btn-blue"
          style={{ marginLeft: "10px" }}
        >
          Withdraw
        </button>
      </div>

      <div className="row">
        <div className="col">
          <div className="table">
            <div className="data">
              <p>Available Margin</p>
              <p className="imp colored">
                ₹ {availableMargin.toLocaleString()}
              </p>
            </div>

            <div className="data">
              <p>Used Margin</p>
              <p className="imp">
                ₹ {usedMargin.toLocaleString()}
              </p>
            </div>

            <div className="data">
              <p>Available Cash</p>
              <p className="imp">
                ₹ {availableCash.toLocaleString()}
              </p>
            </div>

            <hr />

            <div className="data">
              <p>Total Balance</p>
              <p>
                ₹ {(availableMargin + usedMargin).toLocaleString()}
              </p>
            </div>

            <div className="data">
              <p>Today's Deposits</p>
              <p>₹ 0</p>
            </div>

            <div className="data">
              <p>Today's Withdrawals</p>
              <p>₹ 0</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <h4>Account Status</h4>

            <p style={{ marginTop: "15px" }}>
              ✔ Equity Account Active
            </p>

            <p>
              ✔ Portfolio Tracking Enabled
            </p>

            <p>
              ✔ Secure Authentication Enabled
            </p>

            <button className="btn btn-blue" style={{ marginTop: "20px" }}>
              View Statements
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;