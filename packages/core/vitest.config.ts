import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@/types": "./src/types",
      "@/validator": "./src/validator",
      "@/domain": "./src/domain",
      "@/schemas": "./src/schemas",
    },
  },
});
