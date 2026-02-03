import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { App } from "./App";
import type { Storage } from "./storage";
import type { JobApplication } from "./types";

const createMockStorage = (applications: JobApplication[] = []): Storage => ({
  listApplications: vi.fn().mockResolvedValue(applications),
  getApplication: vi.fn(),
  createApplication: vi.fn(),
  updateApplication: vi.fn(),
  deleteApplication: vi.fn(),
  listTasks: vi.fn().mockResolvedValue([]),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  listInterviews: vi.fn().mockResolvedValue([]),
  createInterview: vi.fn(),
  updateInterview: vi.fn(),
  deleteInterview: vi.fn(),
  listNotes: vi.fn().mockResolvedValue([]),
  createNote: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
});

const createApplication = (
  overrides: Partial<JobApplication> = {}
): JobApplication => ({
  id: "test-id",
  companyName: "Test Company",
  roleName: "Test Role",
  score: 3,
  status: "applied",
  createdAt: "2025-01-15T00:00:00.000Z",
  updatedAt: "2025-02-01T00:00:00.000Z",
  ...overrides,
});

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the page heading", () => {
    render(<App storage={createMockStorage()} />);
    expect(
      screen.getByRole("heading", { name: "Candidate Tracker" })
    ).toBeInTheDocument();
  });

  it("renders the Add Application button", () => {
    render(<App storage={createMockStorage()} />);
    expect(
      screen.getByRole("button", { name: /add application/i })
    ).toBeInTheDocument();
  });

  it("renders the status filter", () => {
    render(<App storage={createMockStorage()} />);
    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /applied/i })).toBeInTheDocument();
  });

  it("displays applications from storage", async () => {
    const applications = [
      createApplication({ id: "1", companyName: "Acme Corp" }),
      createApplication({ id: "2", companyName: "Tech Inc" }),
    ];
    const storage = createMockStorage(applications);

    render(<App storage={storage} />);

    await waitFor(() => {
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getByText("Tech Inc")).toBeInTheDocument();
    });
  });

  it("filters applications by status", async () => {
    const user = userEvent.setup();
    const applications = [
      createApplication({ id: "1", companyName: "Applied Co", status: "applied" }),
      createApplication({
        id: "2",
        companyName: "Interviewing Co",
        status: "interviewing",
      }),
    ];
    const storage = createMockStorage(applications);

    render(<App storage={storage} />);

    await waitFor(() => {
      expect(screen.getByText("Applied Co")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /interviewing/i }));

    expect(screen.queryByText("Applied Co")).not.toBeInTheDocument();
    expect(screen.getByText("Interviewing Co")).toBeInTheDocument();
  });

  it("shows empty state when no applications", async () => {
    render(<App storage={createMockStorage([])} />);

    await waitFor(() => {
      expect(screen.getByText(/no applications/i)).toBeInTheDocument();
    });
  });
});
