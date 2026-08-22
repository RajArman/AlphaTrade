import test from "node:test";
import assert from "node:assert/strict";

import { signupSchema, loginSchema } from "../utils/validation.js";
import { getDuplicateKeyField, duplicateUserMessage } from "../utils/authErrors.js";

// --- signupSchema ---

test("signupSchema accepts valid signup input", () => {
  const result = signupSchema.safeParse({
    email: "trader@example.com",
    username: "trader1",
    password: "secret123",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.email, "trader@example.com");
  assert.equal(result.data.username, "trader1");
});

test("signupSchema rejects missing required fields", () => {
  assert.equal(
    signupSchema.safeParse({ username: "trader1", password: "secret123" }).success,
    false
  );
  assert.equal(
    signupSchema.safeParse({ email: "trader@example.com", password: "secret123" }).success,
    false
  );
  assert.equal(
    signupSchema.safeParse({ email: "trader@example.com", username: "trader1" }).success,
    false
  );
});

test("signupSchema rejects an invalid email address", () => {
  const result = signupSchema.safeParse({
    email: "not-an-email",
    username: "trader1",
    password: "secret123",
  });

  assert.equal(result.success, false);
});

test("signupSchema rejects a username shorter than 3 characters", () => {
  const result = signupSchema.safeParse({
    email: "trader@example.com",
    username: "ab",
    password: "secret123",
  });

  assert.equal(result.success, false);
});

test("signupSchema rejects an empty username", () => {
  const result = signupSchema.safeParse({
    email: "trader@example.com",
    username: "",
    password: "secret123",
  });

  assert.equal(result.success, false);
});

test("signupSchema rejects a password shorter than 6 characters", () => {
  const result = signupSchema.safeParse({
    email: "trader@example.com",
    username: "trader1",
    password: "123",
  });

  assert.equal(result.success, false);
});

// --- loginSchema ---

test("loginSchema accepts valid login input", () => {
  const result = loginSchema.safeParse({
    email: "trader@example.com",
    password: "secret123",
  });

  assert.equal(result.success, true);
});

test("loginSchema rejects an invalid email address", () => {
  const result = loginSchema.safeParse({
    email: "not-an-email",
    password: "secret123",
  });

  assert.equal(result.success, false);
});

test("loginSchema rejects a missing password", () => {
  const result = loginSchema.safeParse({ email: "trader@example.com" });

  assert.equal(result.success, false);
});

test("loginSchema rejects a password that is too short", () => {
  const result = loginSchema.safeParse({
    email: "trader@example.com",
    password: "123",
  });

  assert.equal(result.success, false);
});

// --- Duplicate-user error handling ---
// These test the pure helpers signup() uses to turn a pre-check hit or a
// raced MongoDB E11000 duplicate-key error into a clear, field-specific
// response - no real MongoDB instance or HTTP integration involved.

test("getDuplicateKeyField returns the colliding field from a MongoDB E11000 error", () => {
  const mongoDuplicateKeyError = {
    code: 11000,
    keyPattern: { username: 1 },
  };

  assert.equal(getDuplicateKeyField(mongoDuplicateKeyError), "username");
});

test("getDuplicateKeyField returns null for a non-duplicate-key error", () => {
  const validationError = { name: "ValidationError", code: undefined };

  assert.equal(getDuplicateKeyField(validationError), null);
});

test("getDuplicateKeyField returns null for a null/undefined error", () => {
  assert.equal(getDuplicateKeyField(null), null);
  assert.equal(getDuplicateKeyField(undefined), null);
});

test("duplicateUserMessage returns a username-specific message", () => {
  assert.equal(duplicateUserMessage("username"), "Username already taken");
});

test("duplicateUserMessage returns the existing generic message for email (and any other field)", () => {
  assert.equal(duplicateUserMessage("email"), "User already exists");
  assert.equal(duplicateUserMessage(null), "User already exists");
});
