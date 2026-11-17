import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";
import Signup from "./Signup";

const apiFetch = vi.fn();
const setSessionToken = vi.fn();
const navigate = vi.fn();
vi.mock("@/lib/api", async (orig) => ({
  ...(await orig<typeof import("@/lib/api")>()),
  apiFetch: (...a: unknown[]) => apiFetch(...a),
  setSessionToken: (t: string) => setSessionToken(t),
}));
vi.mock("@/lib/navigate", () => ({ useNavigate: () => navigate }));

const pw = () => crypto.randomUUID();
function fill(email: string, password: string) {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
}
const setup = () =>
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>,
  );

describe("Signup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("[AC-001] posts, stores token and navigates", async () => {
    apiFetch.mockResolvedValue({ token: "tok", user: { id: 1, email: "a@b.co" } });
    setup();
    fill("a@b.co", pw());
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("tasks"));
    expect(apiFetch.mock.calls[0][0]).toBe("/auth/signup");
    expect(setSessionToken).toHaveBeenCalledWith("tok");
  });

  it("[AC-002] blank fields show required messages, no request", () => {
    setup();
    fill("", "");
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("[AC-003] short password blocked, no request", () => {
    setup();
    fill("a@b.co", "short");
    expect(screen.getByText("Password must be at least 8 characters long.")).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("[AC-003] server 422 on password shows length message", async () => {
    apiFetch.mockRejectedValue(
      new ApiError("x", 422, { detail: [{ loc: ["body", "password"], msg: "m", type: "t" }] }),
    );
    setup();
    fill("a@b.co", pw());
    expect(
      await screen.findByText("Password must be at least 8 characters long."),
    ).toBeInTheDocument();
  });

  it("[AC-005] [AC-006] [AC-007] 409 shows registered message and login control", async () => {
    apiFetch.mockRejectedValue(new ApiError("x", 409, { detail: "email_already_registered" }));
    setup();
    fill("a@b.co", pw());
    expect(await screen.findByText(/already registered/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Go to log in" }));
    expect(navigate).toHaveBeenCalledWith("login");
  });

  it("[AC-008] bad email format blocked, no request", () => {
    setup();
    fill("nodomain", pw());
    expect(screen.getByText(/That email address format is invalid/)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("[AC-008] server 422 on email shows format message", async () => {
    apiFetch.mockRejectedValue(
      new ApiError("x", 422, { detail: [{ loc: ["body", "email"], msg: "m", type: "t" }] }),
    );
    setup();
    fill("a@b.co", pw());
    expect(await screen.findByText(/That email address format is invalid/)).toBeInTheDocument();
  });

  it("[AC-009] both messages at once", () => {
    setup();
    fill("bad", "short");
    expect(screen.getByText(/format is invalid/)).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters long/)).toBeInTheDocument();
  });

  it("[AC-001] network error shows generic message and re-enables form", async () => {
    apiFetch.mockRejectedValue(new Error("boom"));
    setup();
    fill("a@b.co", pw());
    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeEnabled();
  });

  it("[AC-001] submitting disables button and prevents double submit", async () => {
    apiFetch.mockReturnValue(new Promise(() => {}));
    setup();
    fill("a@b.co", pw());
    const btn = await screen.findByRole("button", { name: /creating account/i });
    expect(btn).toBeDisabled();
    fireEvent.submit(screen.getByRole("form", { name: "Sign up" }));
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });
});
