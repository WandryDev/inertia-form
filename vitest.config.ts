import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
    include: ["src/__tests__/**/*.test.{js,ts,jsx,tsx}"],
  },
});
