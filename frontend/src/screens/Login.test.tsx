import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";
import Login from "./Login";

const apiFetch = vi.fn();
const setSessionToken = vi.fn();
const navigate = vi.fn();
vi.mock("@/lib/api", async (orig) => ({
  ...(await orig<typeof import("@/lib/api")>()),
  apiFetch: (...a: unknown[]) => apiFetch(...a),
  setSessionToken: (t: string) => setSessionToken(t),
}));
vi.mock("@/lib/navigate", () => ({ useNavigate: () => navigate }));

const pw = crypto.randomUUID();
function fill(email: string) {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: pw } });
  fireEvent.click(screen.getByRole("button", { name: /^log in/i }));
}
const setup = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

describe("Login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("[AC-011] posts, stores token and navigates to tasks", async () => {
    apiFetch.mockResolvedValue({ token: "tok", user: { id: 1, email: "a@b.co" } });
    setup();
    fill("a@b.co");
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("tasks"));
    expect(apiFetch.mock.calls[0][0]).toBe("/auth/login");
    expect(setSessionToken).toHaveBeenCalledWith("tok");
  });

  it("[AC-012] email is sent as typed", async () => {
    apiFetch.mockResolvedValue({ token: "t", user: { id: 1, email: "x" } });
    setup();
    fill("MiXed@Case.CO");
    await waitFor(() => expect(apiFetch).toHaveBeenCalled());
    expect(JSON.parse(apiFetch.mock.calls[0][1].body).email).toBe("MiXed@Case.CO");
  });

  it("[AC-013] 401 shows the generic message, password not echoed", async () => {
    apiFetch.mockRejectedValue(
      new ApiError("x", 401, { detail: "email or password is incorrect" }),
    );
    setup();
    fill("a@b.co");
    expect(await screen.findByText("email or password is incorrect")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain(pw);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("[AC-014] no forgot, reset or recover text", () => {
    setup();
    expect(document.body.textContent).not.toMatch(/forgot|reset|recover/i);
  });

  it("[AC-011] network error shows generic message and re-enables button", async () => {
    apiFetch.mockRejectedValue(new Error("boom"));
    setup();
    fill("a@b.co");
    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^log in/i })).toBeEnabled();
  });

  it("[AC-011] submitting disables button and prevents double submit", async () => {
    apiFetch.mockReturnValue(new Promise(() => {}));
    setup();
    fill("a@b.co");
    expect(await screen.findByRole("button", { name: /logging in/i })).toBeDisabled();
    fireEvent.submit(screen.getByRole("form", { name: "Log in" }));
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });

  it("[AC-011] sign up link navigates to signup", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /create an account/i }));
    expect(navigate).toHaveBeenCalledWith("signup");
  });
});
