export class InsufficientBalanceError extends Error {
  constructor(message = "Insufficient balance for this order") {
    super(message);
    this.name = "InsufficientBalanceError";
  }
}

export class HoldingNotFoundError extends Error {
  constructor(message = "You do not own this stock") {
    super(message);
    this.name = "HoldingNotFoundError";
  }
}

export class InsufficientHoldingsError extends Error {
  constructor(message = "You do not own enough shares to sell this quantity") {
    super(message);
    this.name = "InsufficientHoldingsError";
  }
}
