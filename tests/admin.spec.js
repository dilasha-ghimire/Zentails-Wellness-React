import { expect, test } from "@playwright/test";

test.describe("Admin Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("http://localhost:3000/api/pet", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { _id: "pet-1", name: "Buddy" },
          { _id: "pet-2", name: "Max" },
        ]),
      });
    });

    await page.route("http://localhost:3000/api/pet/pet-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          pet: { _id: "pet-1", name: "Buddy", image: "buddy.jpg" },
          healthRecord: { last_checkup_date: "2024-02-20" },
          medicalHistory: [
            { condition: "Allergy", treatment_date: "2023-12-10" },
          ],
          vaccinations: [
            { vaccine_name: "Rabies", vaccination_date: "2024-01-15" },
          ],
          specialNeeds: [{ special_need: "Dietary restrictions" }],
        }),
      });
    });

    await page.route("http://localhost:3000/api/pet/pet-2", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          pet: { _id: "pet-2", name: "Max", image: null },
          healthRecord: {},
          medicalHistory: [],
          vaccinations: [],
          specialNeeds: [],
        }),
      });
    });

    await page.route("http://localhost:3000/api/customer", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            _id: "customer-1",
            full_name: "Alice Johnson",
            email: "alice@example.com",
            contact_number: "1234567890",
            address: "Kathmandu, Nepal",
            active: true,
          },
          {
            _id: "customer-2",
            full_name: "Bob Smith",
            email: "bob@example.com",
            contact_number: "9876543210",
            address: "Pokhara, Nepal",
            active: false,
          },
        ]),
      });
    });

    await page.route(
      "http://localhost:3000/api/customer/customer-1/deactivate",
      async (route) => {
        await route.fulfill({ status: 200 });
      }
    );

    await page.goto("http://localhost:5173/admin");
  });

  test("should navigate to Health Record and display pet cards", async ({
    page,
  }) => {
    await page.click("text=Health Record");
    await page.waitForTimeout(2000);

    const petCards = page.locator(".bg-white");
    await expect(petCards).toHaveCount(2);

    await expect(page.locator("text=Buddy")).toBeVisible();
    await expect(page.locator("text=Max")).toBeVisible();
  });

  test("should navigate to Customers and display customer cards", async ({
    page,
  }) => {
    await page.click("text=Customers");
    await page.waitForTimeout(2000);

    const customerCards = page.locator(".bg-gradient-to-br");
    await expect(customerCards).toHaveCount(2);

    await expect(page.locator("text=Alice Johnson")).toBeVisible();
    await expect(page.locator("text=Bob Smith")).toBeVisible();
  });

  test("should deactivate a customer", async ({ page }) => {
    await page.click("text=Customers");
    await page.waitForTimeout(2000);

    await page.waitForSelector("button:has-text('Deactivate')");

    page.once("dialog", (dialog) => dialog.accept());

    const [response] = await Promise.all([
      page.waitForResponse((res) =>
        res.url().includes("/api/customer/customer-1/deactivate")
      ),
      page.click("button:has-text('Deactivate')"),
    ]);

    expect(response.status()).toBe(200);
  });

  test("should logout successfully", async ({ page }) => {
    await page.click("button:has-text('Logout')");

    await expect(page).toHaveURL("http://localhost:5173/");

    const localStorageKeys = await page.evaluate(() =>
      Object.keys(localStorage)
    );
    expect(localStorageKeys).toHaveLength(0);
  });
});
