import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("should navigate to login page and display form", async ({ page }) => {
    await page.goto("/");

    // Click the top login button (navigates via Router)
    await page.getByRole("link", { name: "Log In" }).first().click();

    // Check URL
    await expect(page).toHaveURL(/.*\/login/);

    // Verify form elements
    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("name@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign in to TripGenius" }),
    ).toBeVisible();
  });

  test("should allow entering guest mode from login page", async ({ page }) => {
    await page.goto("/login");

    // Click guest mode
    await page.getByRole("button", { name: "Continue as Guest" }).click();

    // Should navigate to planner
    await expect(page).toHaveURL(/.*\/planner/);

    // Top nav should show Log In link again for guests
    await expect(
      page.locator("nav").getByRole("link", { name: "Log In" }),
    ).toBeVisible();
  });
});
