import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDashboardSummaryCacheKey,
  getCachedDashboardSummary,
  setCachedDashboardSummary,
  invalidateDashboardSummary,
} from "../utils/cache.js";

// These tests use small fake Redis clients (plain objects implementing the
// get/set/del/isReady surface cache.js actually calls) - no real Redis
// server or live MongoDB is used or required anywhere here. Every
// exported function accepts an optional client override for exactly this
// purpose.

const fakeReadyClient = (overrides = {}) => ({
  isReady: true,
  get: async () => null,
  set: async () => "OK",
  del: async () => 1,
  ...overrides,
});

test("buildDashboardSummaryCacheKey produces a user-specific key", () => {
  assert.equal(buildDashboardSummaryCacheKey("abc123"), "dashboard:summary:abc123");
});

test("buildDashboardSummaryCacheKey never collides across different users", () => {
  const keyA = buildDashboardSummaryCacheKey("user-a");
  const keyB = buildDashboardSummaryCacheKey("user-b");

  assert.notEqual(keyA, keyB);
});

test("getCachedDashboardSummary returns the parsed value on a cache hit", async () => {
  const storedSummary = { success: true, investment: 5000 };
  let requestedKey;

  const client = fakeReadyClient({
    get: async (key) => {
      requestedKey = key;
      return JSON.stringify(storedSummary);
    },
  });

  const result = await getCachedDashboardSummary("user-1", client);

  assert.equal(requestedKey, "dashboard:summary:user-1");
  assert.deepEqual(result, storedSummary);
});

test("getCachedDashboardSummary returns null on a cache miss", async () => {
  const client = fakeReadyClient({ get: async () => null });

  const result = await getCachedDashboardSummary("user-1", client);

  assert.equal(result, null);
});

test("getCachedDashboardSummary falls back to null when Redis GET fails", async () => {
  const client = fakeReadyClient({
    get: async () => {
      throw new Error("connection lost");
    },
  });

  const result = await getCachedDashboardSummary("user-1", client);

  assert.equal(result, null);
});

test("setCachedDashboardSummary stores JSON with the correct key and TTL", async () => {
  let calledWith;

  const client = fakeReadyClient({
    set: async (key, value, options) => {
      calledWith = { key, value, options };
      return "OK";
    },
  });

  await setCachedDashboardSummary("user-1", { success: true, investment: 100 }, client);

  assert.equal(calledWith.key, "dashboard:summary:user-1");
  assert.deepEqual(JSON.parse(calledWith.value), { success: true, investment: 100 });
  assert.deepEqual(calledWith.options, { expiration: { type: "EX", value: 60 } });
});

test("setCachedDashboardSummary does not throw when Redis SET fails", async () => {
  const client = fakeReadyClient({
    set: async () => {
      throw new Error("write failed");
    },
  });

  await assert.doesNotReject(
    setCachedDashboardSummary("user-1", { success: true }, client)
  );
});

test("invalidateDashboardSummary deletes the correct user-specific key", async () => {
  let deletedKey;

  const client = fakeReadyClient({
    del: async (key) => {
      deletedKey = key;
      return 1;
    },
  });

  await invalidateDashboardSummary("user-42", client);

  assert.equal(deletedKey, "dashboard:summary:user-42");
});

test("invalidateDashboardSummary does not throw when Redis DELETE fails", async () => {
  const client = fakeReadyClient({
    del: async () => {
      throw new Error("connection reset");
    },
  });

  await assert.doesNotReject(invalidateDashboardSummary("user-1", client));
});

test("all cache functions are safe no-ops when Redis is not configured (client is null)", async () => {
  await assert.doesNotReject(async () => {
    const result = await getCachedDashboardSummary("user-1", null);
    assert.equal(result, null);

    await setCachedDashboardSummary("user-1", { success: true }, null);
    await invalidateDashboardSummary("user-1", null);
  });
});

test("all cache functions are safe no-ops when the client exists but isn't ready", async () => {
  const notReadyClient = { isReady: false, get: async () => "should not be called" };

  const result = await getCachedDashboardSummary("user-1", notReadyClient);

  assert.equal(result, null);
});
