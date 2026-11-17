import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

const API = process.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";
const GENERIC = "email or password is incorrect";

async function signupViaApi(request: APIRequestContext) {
  const email = `qa-${randomUUID()}@example.com`;
  const password = randomUUID().slice(0, 16);
  const res = await request.post(`${API}/auth/signup`, { data: { email, password } });
  expect(res.status()).toBe(201);
  return { email, password, id: (await res.json()).user.id as number };
}

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /^log in$/i }).click();
}

test("[AC-011] logged-out user logs in and lands on the task list", async ({ page, request }) => {
  const u = await signupViaApi(request);
  await page.goto("/login");
  await page.evaluate(() => localStorage.clear());
  await login(page, u.email, u.password);
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(page.getByRole("heading", { name: "My tasks" })).toBeVisible();
});

test("[AC-012] upper-cased email reaches the same account", async ({ page, request }) => {
  const u = await signupViaApi(request);
  await login(page, u.email.toUpperCase(), u.password);
  await expect(page).toHaveURL(/\/tasks$/);
  const res = await request.post(`${API}/auth/login`, {
    data: { email: u.email.toUpperCase(), password: u.password },
  });
  expect((await res.json()).user.id).toBe(u.id);
});

test("[AC-013] [NFR-004] unknown email and wrong password show the same message", async ({
  page,
  request,
}) => {
  const u = await signupViaApi(request);
  for (const [email, pw] of [
    [`qa-${randomUUID()}@example.com`, randomUUID().slice(0, 16)],
    [u.email, randomUUID().slice(0, 16)],
  ]) {
    await login(page, email, pw);
    await expect(page.getByRole("alert")).toHaveText(GENERIC);
    await expect(page).toHaveURL(/\/login$/);
  }
});

test("[AC-014] login page has no forgot-password or reset link", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /^log in$/i })).toBeVisible();
  await expect(page.getByText(/forgot|reset/i)).toHaveCount(0);
  await expect(page.locator('a[href*="forgot" i], a[href*="reset" i]')).toHaveCount(0);
});
