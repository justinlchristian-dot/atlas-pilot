import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", text: "Good morning" },
  { path: "/today", text: "Daily Brief" },
  { path: "/onboarding", text: "Make Atlas useful" },
  { path: "/pilot-guide", text: "Help test Atlas safely" },
  { path: "/command", text: "What Atlas understands" },
  { path: "/shopping", text: "Prepared, not ordered" },
  { path: "/personas", text: "Test Atlas with synthetic households" },
  { path: "/approvals", text: "Review before Atlas acts" },
  { path: "/audit", text: "Every decision, visible" },
  { path: "/settings", text: "You control what Atlas surfaces" },
  { path: "/calendar", text: "Pilot placeholder" },
  { path: "/vault", text: "Pilot placeholder" },
  { path: "/feedback", text: "Capture tester notes without sending data" },
];

test.describe("major route smoke tests", () => {
  for (const route of routes) {
    test(`${route.path} loads expected Atlas content`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByText(route.text).first()).toBeVisible();
      await expect(page.getByText("This page could not be found")).toHaveCount(0);
      await expect(page.getByText("Application error")).toHaveCount(0);
    });
  }
});

test.describe("mobile route smoke tests", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

  for (const route of routes) {
    test(`${route.path} is readable at mobile viewport`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
      await expect(page.getByText(route.text).first()).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(2);
    });
  }
});

test("onboarding display name personalizes Today", async ({ page }) => {
  await page.goto("/onboarding");
  await page.getByRole("button", { name: /Start setup/i }).click();
  await page.getByLabel("First name / display name").fill("Pilot Tester");
  await page.waitForFunction(() => {
    const stored = window.localStorage.getItem("atlas-pilot-onboarding-v1");
    return stored?.includes("Pilot Tester");
  });

  await page.goto("/today");
  await expect(page.getByText("Good morning, Pilot Tester.")).toBeVisible();
});

test("loading a persona personalizes Today", async ({ page }) => {
  await page.goto("/personas");
  await page
    .getByRole("button", { name: /Load persona/i })
    .first()
    .click();
  await expect(page.getByText("Persona loaded locally")).toBeVisible();

  await page.getByRole("link", { name: /Go to Today/i }).click();
  await expect(page.getByText("Good morning, Morgan.")).toBeVisible();
  await expect(page.getByText("Enabled life areas today")).toBeVisible();
});
