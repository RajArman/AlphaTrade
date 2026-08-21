export class InsufficientBalanceError extends Error {
  constructor(message = "Insufficient balance for this order") {
    super(message);
    this.name = "InsufficientBalanceError";
  }
}
