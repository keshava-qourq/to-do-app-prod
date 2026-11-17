import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";
import Tasks from "./Tasks";

const apiFetch = vi.fn();
const clearSessionToken = vi.fn();
const navigate = vi.fn();
vi.mock("@/lib/api", async (orig) => ({
  ...(await orig<typeof import("@/lib/api")>()),
  apiFetch: (...a: unknown[]) => apiFetch(...a),
  clearSessionToken: () => clearSessionToken(),
}));
vi.mock("@/lib/navigate", () => ({ useNavigate: () => navigate }));

const setup = () =>
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>,
  );

describe("Tasks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("[AC-004] renders tasks from GET /tasks", async () => {
    apiFetch.mockResolvedValue([
      { id: 1, title: "Real task", completed: false, created_at: "2026-11-17T09:00:00Z" },
    ]);
    setup();
    expect(await screen.findByText("Real task")).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledWith("/tasks");
    expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
  });

  it("[AC-004] shows empty message for a new account", async () => {
    apiFetch.mockResolvedValue([]);
    setup();
    expect(await screen.findByText("No tasks yet.")).toBeInTheDocument();
  });

  it("[AC-004] 401 clears token and goes to login", async () => {
    apiFetch.mockRejectedValue(new ApiError("x", 401, { detail: "no" }));
    setup();
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("login"));
    expect(clearSessionToken).toHaveBeenCalled();
  });
});
