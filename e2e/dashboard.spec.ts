import { test, expect } from "@playwright/test";

test.describe("Dashboard Flow", () => {
  test("should load dashboard and display widgets", async ({ page }) => {
    // Override localStorage to force guest mode without onboarding
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("tg_onboarded", "true");
    });

    // Go to dashboard
    await page.goto("/dashboard");

    // Check header
    await expect(
      page.locator("h1").filter({ hasText: "Dashboard" }),
    ).toBeVisible();

    // Check quick actions
    await expect(page.getByRole("link", { name: /new trip/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /export print/i }),
    ).toBeVisible();

    // Check Countdown widget
    await expect(page.getByText("Next Trip Countdown")).toBeVisible();

    // Check Explore Destinations widget
    await expect(page.getByText("Explore Destinations")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /start quiz/i }),
    ).toBeVisible();

    // Verify recent activity empty state
    await expect(page.getByText("No recent activity")).toBeVisible();
  });
});
