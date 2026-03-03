import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: [path.resolve(process.cwd(), "vitest.setup.ts")],
    include: ["**/*.test.ts", "**/*.spec.ts"],
    testTimeout: 30000,
  },
  resolve: {
    alias: { "@": path.resolve(process.cwd()) },
  },
});
