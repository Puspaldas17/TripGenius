import { test, expect } from "@playwright/test";

test.describe("Planner Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("tg_onboarded", "true"));
  });

  test("should open Planner and generate itinerary form", async ({ page }) => {
    await page.goto("/planner");

    // The main layout should appear
    await expect(
      page.getByRole("heading", { name: /where to next/i }),
    ).toBeVisible();

    // Verify form fields
    const destInput = page.getByPlaceholder("e.g., Tokyo, Japan");
    await expect(destInput).toBeVisible();

    const budgetInput = page.getByRole("spinbutton").first(); // Top budget input
    await expect(budgetInput).toBeVisible();

    // Test form interaction
    await destInput.fill("Bali, Indonesia");
    await page.getByRole("button", { name: /generate/i }).click();

    // Since we don't mock the AI backend here, we expect the loading state to appear
    await expect(
      page.getByRole("button", { name: /generating/i }),
    ).toBeVisible();
  });

  test("should open AIChat widget via shortcut", async ({ page }) => {
    await page.goto("/planner");

    // Wait for page to settle
    await page.waitForTimeout(500);

    // Press Ctrl+K
    await page.keyboard.press("Control+K");

    // Chat window should be visible
    await expect(
      page.getByRole("heading", { name: "AI Travel Assistant" }),
    ).toBeVisible();

    // Test chat input
    await page
      .getByPlaceholder(/ask me anything/i)
      .type("What is the weather in Bali?");
    await page
      .getByRole("button", { name: /send/i, exact: false })
      .nth(1)
      .click();
  });
});
