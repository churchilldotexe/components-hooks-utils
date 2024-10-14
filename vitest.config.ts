import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".git", ".cache"],
    setupFiles: "./src/vitest.setup.ts",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    css: true,
  },
  resolve: { alias: { "@": "/src" } },
});
