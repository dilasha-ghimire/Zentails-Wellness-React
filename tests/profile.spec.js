import { expect, test } from "@playwright/test";

const API_URL = "http://localhost:3000/api/customer";
const USER_ID = "mock-user-id";
const AUTH_TOKEN = "mock-auth-token";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("authToken", "mock-auth-token");
    localStorage.setItem("userId", "mock-user-id");
  });

  await page.route(`${API_URL}/${USER_ID}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        profilePicture: "profile.jpg",
        full_name: "John Doe",
        email: "john@example.com",
        contact_number: "1234567890",
        address: "123 Street, City",
      }),
    });
  });

  await page.goto("http://localhost:5173/profile");
});

test.describe("Profile Page Tests", () => {
  test("Renders profile page correctly", async ({ page }) => {
    await expect(page.locator("text=Profile")).toBeVisible();
    await expect(page.locator('label:text("Full Name") + input')).toBeVisible();
    await expect(page.locator('label:text("Address") + input')).toBeVisible();
    await expect(page.locator('button:text("Update")')).toBeVisible();
  });

  test("Should show authorization error if user is not logged in", async ({
    page,
    context,
  }) => {
    await context.addInitScript(() => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
    });

    await page.reload();
    await expect(
      page.locator("text=You must log in to access this page.")
    ).toBeVisible();
  });

  test("Fetches and displays user profile data correctly", async ({ page }) => {
    await expect(page.locator('input[value="John Doe"]')).toBeVisible();
    await expect(page.locator('input[value="john@example.com"]')).toBeVisible();
  });

  test("Navigates back to the homepage", async ({ page }) => {
    await page.click("text=Homepage");
    await expect(page).toHaveURL("http://localhost:5173/homepage");
  });
});
