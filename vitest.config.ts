import { defineConfig } from "vitest/config";


export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,

    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "src/**/*.test.{js,jsx,ts,tsx}",
        "src/**/*.spec.{js,jsx,ts,tsx}",
        "src/index.{js,jsx,ts,tsx}",
        "src/setupTests.{js,ts}",
        "src/utils",
        "src/**/*.d.ts",
      ],
      reporter: ["text", "json", "html"],
    },
  },
  esbuild: {
    jsx: "automatic",
  },
});
