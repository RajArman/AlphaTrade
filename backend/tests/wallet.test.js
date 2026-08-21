import test from "node:test";
import assert from "node:assert/strict";

import User, { DEFAULT_STARTING_BALANCE, getUserBalance } from "../model/UserModel.js";

test("new user document defaults to the starting virtual balance", () => {
  const user = new User({
    username: "trader1",
    email: "trader1@example.com",
    password: "hashedpassword",
  });

  assert.equal(user.balance, DEFAULT_STARTING_BALANCE);
  assert.equal(DEFAULT_STARTING_BALANCE, 100000);
});

test("getUserBalance returns the real balance when present", () => {
  const user = new User({
    username: "trader2",
    email: "trader2@example.com",
    password: "hashedpassword",
    balance: 54321,
  });

  assert.equal(getUserBalance(user), 54321);
});

test("getUserBalance falls back to the default for legacy users missing the field", () => {
  // Simulates a user document persisted before the balance field existed,
  // where the raw DB record has no `balance` key at all.
  const legacyUser = { username: "legacy", email: "legacy@example.com" };
  delete legacyUser.balance;

  assert.equal(getUserBalance(legacyUser), DEFAULT_STARTING_BALANCE);
  assert.equal(getUserBalance({ balance: null }), DEFAULT_STARTING_BALANCE);
  assert.equal(getUserBalance(undefined), DEFAULT_STARTING_BALANCE);
});
