import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      NODE_ENV: "test",
    },
    include: ["test/**/*.test.js"],
    setupFiles: ["./test/setup.js"],
    // mongodb-memory-server can take a while to download/start on a cold
    // cache (first run in CI or on a fresh machine).
    hookTimeout: 60000,
    testTimeout: 15000,
  },
});
