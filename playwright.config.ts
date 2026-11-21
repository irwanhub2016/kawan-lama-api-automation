import { defineConfig } from "@playwright/test";
import { environment } from "./src/config/environment.js";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL: environment.baseUrl,
    actionTimeout: 20_000,
    extraHTTPHeaders: {
      accept: "application/json",
      "content-type": "application/json",
    },
  },
});
