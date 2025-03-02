import { expect, test } from "@playwright/test";

test.describe("Login Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("http://localhost:3000/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, token: "fake-token" }),
      });
    });

    await page.goto("http://localhost:5173/");
  });

  test("Should render login page correctly", async ({ page }) => {
    await expect(page.locator("text=WELCOME")).toBeVisible();
    await expect(
      page.locator('label:text("Email or Phone number") + input')
    ).toBeVisible();
    await expect(page.locator('label:text("Password") + input')).toBeVisible();
    await expect(page.locator("button", { hasText: "Log In" })).toBeVisible();
  });

  test("Should show error on empty fields", async ({ page }) => {
    await page.click('button:has-text("Log In")');

    await expect(page.locator("p.text-red-400")).toHaveText(
      "Login failed. Try again."
    );
  });

  test("Should show error on invalid credentials", async ({ page }) => {
    await page
      .locator('label:text("Email or Phone number") + input')
      .fill("invalid@example.com");
    await page.locator('label:text("Password") + input').fill("wrongpassword");
    await page.click('button:has-text("Log In")');

    await expect(page.locator("text=Login failed. Try again.")).toBeVisible();
  });

  test("Should login successfully with valid credentials", async ({ page }) => {
    await page
      .locator('label:text("Email or Phone number") + input')
      .fill("test@example.com");
    await page.locator('label:text("Password") + input').fill("password123");

    const [response] = await Promise.all([
      page.waitForResponse("http://localhost:3000/api/auth/login"),
      page.click('button:has-text("Log In")'),
    ]);

    const responseBody = await response.json();
    console.log("Mock API Response:", responseBody);
    expect(responseBody).toHaveProperty("token");

    const storedToken = await page.evaluate(() =>
      localStorage.getItem("authToken")
    );
    expect(storedToken).toBe("fake-token");
  });
});
