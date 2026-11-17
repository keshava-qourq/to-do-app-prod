import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

const API = process.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";
const uniqueEmail = () => `qa-${randomUUID()}@example.com`;
const strongPw = () => randomUUID().slice(0, 16);

async function fill(page: Page, email: string, password: string) {
  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/^Password/).fill(password);
  await page.getByRole("button", { name: /create account/i }).click();
}

test("[AC-001] [AC-004] new email signs up, lands on task list with empty message", async ({
  page,
}) => {
  await fill(page, uniqueEmail(), strongPw());
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(page.getByRole("heading", { name: "My tasks" })).toBeVisible();
  await expect(page.getByText("No tasks yet.")).toBeVisible();
});

test("[AC-002] blank email and password show required messages", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page.getByText("Email is required.")).toBeVisible();
  await expect(page.getByText("Password is required.")).toBeVisible();
  await expect(page).toHaveURL(/\/signup$/);
});

test("[AC-003] 7-character password shows length message", async ({ page }) => {
  await fill(page, uniqueEmail(), "abcdefg");
  await expect(page.getByText(/at least 8 characters/i).first()).toBeVisible();
  await expect(page).toHaveURL(/\/signup$/);
});

test("[AC-005] [AC-006] [AC-007] duplicate email, exact and different case", async ({ page }) => {
  const email = uniqueEmail();
  const pw = strongPw();
  await fill(page, email, pw);
  await expect(page).toHaveURL(/\/tasks$/);
  for (const variant of [email, email.toUpperCase()]) {
    await page.evaluate(() => localStorage.clear());
    await fill(page, variant, pw);
    await expect(page.getByText(/already registered/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Go to log in" })).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
  }
});

test("[AC-008] bad email format shows format message", async ({ page }) => {
  await fill(page, "not-an-email", strongPw());
  await expect(page.getByText(/email address format is invalid/i)).toBeVisible();
});

test("[AC-009] bad email and short password show both messages", async ({ page }) => {
  await fill(page, "not-an-email", "short");
  await expect(page.getByText(/email address format is invalid/i)).toBeVisible();
  await expect(page.getByText(/at least 8 characters long/i)).toBeVisible();
});

test("[AC-004] fresh account via API sees empty tasks over the API", async ({ request }) => {
  // Direct DB insertion of another user's task is not possible from a spec (no scripts
  // allowed); the cross-user leak is covered by the pytest acceptance suite.
  const res = await request.post(`${API}/auth/signup`, {
    data: { email: uniqueEmail(), password: strongPw() },
  });
  expect(res.status()).toBe(201);
  const { token } = await res.json();
  const tasks = await request.get(`${API}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(await tasks.json()).toEqual([]);
});
