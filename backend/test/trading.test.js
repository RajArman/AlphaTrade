import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { signupUser, authed } from "./helpers.js";

const STARTING_BALANCE = 100000;

const buy = (token, order) =>
  request(app).post("/newOrder").set("Authorization", authed(token)).send(order);

const sell = (token, order) =>
  request(app).post("/sellOrder").set("Authorization", authed(token)).send(order);

describe("Buy execution", () => {
  test("a successful buy deducts the correct amount and creates a holding", async () => {
    const { token } = await signupUser();

    const res = await buy(token, { name: "INFY", qty: 10, price: 100 });

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(STARTING_BALANCE - 1000);

    const holdings = await request(app).get("/allHoldings").set("Authorization", authed(token));
    expect(holdings.body).toHaveLength(1);
    expect(holdings.body[0]).toMatchObject({ name: "INFY", qty: 10, avg: 100 });
  });

  test("buying the same stock again recalculates the weighted average price", async () => {
    const { token } = await signupUser();

    await buy(token, { name: "TCS", qty: 2, price: 100 });
    await buy(token, { name: "TCS", qty: 2, price: 200 });

    const holdings = await request(app).get("/allHoldings").set("Authorization", authed(token));
    expect(holdings.body).toHaveLength(1);
    expect(holdings.body[0].qty).toBe(4);
    expect(holdings.body[0].avg).toBe(150); // (2*100 + 2*200) / 4
  });

  test("rejects a buy that exceeds the available balance, and leaves the balance unchanged", async () => {
    const { token } = await signupUser();

    const res = await buy(token, { name: "RELIANCE", qty: 1000, price: 5000 });
    expect(res.status).toBe(400);

    const summary = await request(app).get("/dashboardSummary").set("Authorization", authed(token));
    expect(summary.body.availableMargin).toBe(STARTING_BALANCE);
  });

  test("rejects a buy with a non-positive quantity", async () => {
    const { token } = await signupUser();

    const res = await buy(token, { name: "WIPRO", qty: -5, price: 100 });

    expect(res.status).toBe(400);
  });
});

describe("Sell execution", () => {
  test("a successful sell credits the balance and reduces the holding", async () => {
    const { token } = await signupUser();

    await buy(token, { name: "INFY", qty: 10, price: 100 });
    const res = await sell(token, { name: "INFY", qty: 4, price: 120 });

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(STARTING_BALANCE - 1000 + 480);

    const holdings = await request(app).get("/allHoldings").set("Authorization", authed(token));
    expect(holdings.body[0].qty).toBe(6);
    // Selling never changes the remaining shares' average buy price.
    expect(holdings.body[0].avg).toBe(100);
  });

  test("selling the entire position removes the holding", async () => {
    const { token } = await signupUser();

    await buy(token, { name: "TCS", qty: 5, price: 100 });
    const res = await sell(token, { name: "TCS", qty: 5, price: 110 });

    expect(res.body.holdingRemoved).toBe(true);

    const holdings = await request(app).get("/allHoldings").set("Authorization", authed(token));
    expect(holdings.body).toHaveLength(0);
  });

  test("rejects selling more shares than owned, and leaves the holding unchanged", async () => {
    const { token } = await signupUser();

    await buy(token, { name: "WIPRO", qty: 5, price: 100 });
    const res = await sell(token, { name: "WIPRO", qty: 10, price: 100 });

    expect(res.status).toBe(400);

    const holdings = await request(app).get("/allHoldings").set("Authorization", authed(token));
    expect(holdings.body[0].qty).toBe(5);
  });

  test("rejects selling a stock the user does not own", async () => {
    const { token } = await signupUser();

    const res = await sell(token, { name: "GOOGL", qty: 1, price: 100 });

    expect(res.status).toBe(400);
  });
});

describe("Order history and dashboard summary", () => {
  test("GET /allOrders returns this user's orders, newest first", async () => {
    const { token } = await signupUser();

    await buy(token, { name: "INFY", qty: 1, price: 100 });
    await buy(token, { name: "TCS", qty: 1, price: 200 });

    const res = await request(app).get("/allOrders").set("Authorization", authed(token));

    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe("TCS");
    expect(res.body[1].name).toBe("INFY");
  });

  test("GET /dashboardSummary reflects investment, current value, and P&L after a trade", async () => {
    const { token } = await signupUser();

    await buy(token, { name: "INFY", qty: 10, price: 100 });

    const res = await request(app).get("/dashboardSummary").set("Authorization", authed(token));

    expect(res.body.investment).toBe(1000);
    expect(res.body.currentValue).toBe(1000);
    expect(res.body.profitLoss).toBe(0);
    expect(res.body.totalAccountValue).toBe(STARTING_BALANCE - 1000 + 1000);
  });
});
