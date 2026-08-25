import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { signupUser, authed } from "./helpers.js";

describe("Protected routes", () => {
  test("GET /auth/me without a token is rejected", async () => {
    const res = await request(app).get("/auth/me");

    expect(res.status).toBe(401);
  });

  test("GET /auth/me with an invalid/malformed token is rejected", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", authed("not-a-real-jwt"));

    expect(res.status).toBe(401);
  });

  test("GET /auth/me with a valid token returns the authenticated user", async () => {
    const { payload, token } = await signupUser();

    const res = await request(app).get("/auth/me").set("Authorization", authed(token));

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(payload.email);
  });

  test("GET /allHoldings without a token is rejected", async () => {
    const res = await request(app).get("/allHoldings");

    expect(res.status).toBe(401);
  });

  test("a user can only ever see their own holdings, never another user's", async () => {
    const userA = await signupUser();
    const userB = await signupUser();

    await request(app)
      .post("/newOrder")
      .set("Authorization", authed(userA.token))
      .send({ name: "INFY", qty: 1, price: 100 });

    await request(app)
      .post("/newOrder")
      .set("Authorization", authed(userB.token))
      .send({ name: "TCS", qty: 1, price: 200 });

    const holdingsA = await request(app)
      .get("/allHoldings")
      .set("Authorization", authed(userA.token));

    const holdingsB = await request(app)
      .get("/allHoldings")
      .set("Authorization", authed(userB.token));

    expect(holdingsA.body).toHaveLength(1);
    expect(holdingsA.body[0].name).toBe("INFY");

    expect(holdingsB.body).toHaveLength(1);
    expect(holdingsB.body[0].name).toBe("TCS");
  });
});
