import request from "supertest";
import app from "../app.js";

let counter = 0;

// Unique-enough email/username per call so tests can run in any order
// without colliding on the User model's unique constraints.
export const uniqueUser = (overrides = {}) => {
  counter += 1;
  return {
    email: `trader${Date.now()}${counter}@example.com`,
    username: `trader${Date.now()}${counter}`,
    password: "secret123",
    ...overrides,
  };
};

export const signupUser = async (overrides = {}) => {
  const payload = uniqueUser(overrides);
  const res = await request(app).post("/auth/signup").send(payload);
  return { res, payload, token: res.body.token };
};

export const authed = (token) => `Bearer ${token}`;
