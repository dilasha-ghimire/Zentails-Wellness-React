import { expect, test } from "@playwright/test";

test.describe("History Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("authToken", "mock-auth-token");
      localStorage.setItem("userId", "mock-user-id");
    });

    await page.route(
      "**/api/therapysessions/user/mock-user-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              _id: "session1",
              pet_id: {
                name: "Buddy",
                breed: "Golden Retriever",
                image: "buddy.jpg",
              },
              date: "2025-03-02T00:00:00.000Z",
              start_time: 1000,
              end_time: 1100,
              total_charge: 500,
              status: "Completed",
            },
          ]),
        });
      }
    );

    await page.goto("http://localhost:5173/history");
  });

  test("Should render the History page correctly", async ({ page }) => {
    await expect(page.locator("text=History")).toBeVisible();
    await expect(page.locator("text=WELCOME")).toBeVisible();
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

  test("Should display session details correctly", async ({ page }) => {
    await expect(page.locator("text=Buddy")).toBeVisible();
    await expect(page.locator("text=Golden Retriever")).toBeVisible();
    await expect(page.locator("text=Completed")).toBeVisible();
    await expect(page.locator("text=Total Charge: Rs. 500")).toBeVisible();
  });

  test("Should handle empty session history properly", async ({ page }) => {
    await page.route(
      "**/api/therapysessions/user/mock-user-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      }
    );

    await page.reload();
  });
});
