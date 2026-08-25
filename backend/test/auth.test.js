import { describe, test, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app.js";
import User from "../model/UserModel.js";
import { uniqueUser, signupUser } from "./helpers.js";

describe("POST /auth/signup", () => {
  test("registers a new user and returns a token and user object", async () => {
    const payload = uniqueUser();

    const res = await request(app).post("/auth/signup").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe(payload.email);
    expect(res.body.user.username).toBe(payload.username);
    // The API response should never echo the password back.
    expect(res.body.user.password).toBeUndefined();
  });

  test("stores the password hashed, never in plaintext", async () => {
    const payload = uniqueUser();

    await request(app).post("/auth/signup").send(payload);

    const stored = await User.findOne({ email: payload.email });
    expect(stored.password).not.toBe(payload.password);
    expect(await bcrypt.compare(payload.password, stored.password)).toBe(true);
  });

  test("gives a new user the default starting wallet balance", async () => {
    const payload = uniqueUser();

    await request(app).post("/auth/signup").send(payload);

    const stored = await User.findOne({ email: payload.email });
    expect(stored.balance).toBe(100000);
  });

  test("rejects signup with an email that is already registered", async () => {
    const { payload } = await signupUser();

    const res = await request(app)
      .post("/auth/signup")
      .send(uniqueUser({ email: payload.email }));

    expect(res.status).toBe(409);
  });

  test("rejects signup with a username that is already taken", async () => {
    const { payload } = await signupUser();

    const res = await request(app)
      .post("/auth/signup")
      .send(uniqueUser({ username: payload.username }));

    expect(res.status).toBe(409);
  });

  test("rejects an invalid signup payload (password too short)", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send(uniqueUser({ password: "123" }));

    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  test("logs in successfully with correct credentials", async () => {
    const { payload } = await signupUser();

    const res = await request(app)
      .post("/auth/login")
      .send({ email: payload.email, password: payload.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe(payload.email);
  });

  test("rejects login with an incorrect password", async () => {
    const { payload } = await signupUser();

    const res = await request(app)
      .post("/auth/login")
      .send({ email: payload.email, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  test("rejects login for an email that was never registered", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nobody-here@example.com", password: "secret123" });

    expect(res.status).toBe(401);
  });
});
