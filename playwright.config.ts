import { defineConfig, devices } from "@playwright/test";

const nodeExecutable = JSON.stringify(process.execPath);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 8_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3210",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `${nodeExecutable} node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3210`,
    url: "http://127.0.0.1:3210",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
