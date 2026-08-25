import { beforeAll, afterEach, afterAll } from "vitest";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

// Guarantees a working JWT secret even on a fresh clone with no .env file -
// a real .env's TOKEN_KEY (if present) is left untouched, since this only
// sets the variable when it isn't already set.
process.env.TOKEN_KEY = process.env.TOKEN_KEY || "vitest-test-token-key";

let mongod;

beforeAll(async () => {
  // Buy/sell rely on Mongoose sessions/transactions (see app.js), which
  // MongoDB only supports on a replica set (this is also why MongoDB Atlas
  // is used in production - every Atlas cluster is a replica set). A plain
  // MongoMemoryServer is a standalone instance and can't run transactions,
  // so a single-node in-memory replica set is used here instead.
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongod.getUri());
});

// Each test starts from a clean database - tests don't depend on each
// other's data or on run order.
afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
}, 30000);
