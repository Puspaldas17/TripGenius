import { test, expect } from "@playwright/test";

test("has title and dashboard loaded", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TripGenius/);

  // Expect the main Application body to load successfully
  await expect(page.locator("body")).toBeVisible();
});
