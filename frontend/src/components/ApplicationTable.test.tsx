import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ApplicationTable } from "./ApplicationTable";
import type { JobApplication } from "../types";

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

describe("ApplicationTable", () => {
  it("renders table headers", () => {
    render(<ApplicationTable applications={[]} onSelectApplication={() => {}} />);

    expect(screen.getByRole("columnheader", { name: /company/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /role/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /score/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /salary/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /updated/i })).toBeInTheDocument();
  });

  it("renders empty state when no applications", () => {
    render(<ApplicationTable applications={[]} onSelectApplication={() => {}} />);

    expect(screen.getByText(/no applications/i)).toBeInTheDocument();
  });

  it("renders application data in table rows", () => {
    const application = createApplication({
      companyName: "Acme Corp",
      roleName: "Senior Engineer",
      status: "interviewing",
      score: 4,
      salaryMin: 150000,
      salaryMax: 180000,
    });

    render(
      <ApplicationTable
        applications={[application]}
        onSelectApplication={() => {}}
      />
    );

    const row = screen.getByRole("row", { name: /acme corp/i });
    expect(within(row).getByText("Acme Corp")).toBeInTheDocument();
    expect(within(row).getByText("Senior Engineer")).toBeInTheDocument();
    expect(within(row).getByText(/interviewing/i)).toBeInTheDocument();
  });

  it("displays salary range when both min and max are provided", () => {
    const application = createApplication({
      salaryMin: 150000,
      salaryMax: 180000,
    });

    render(
      <ApplicationTable
        applications={[application]}
        onSelectApplication={() => {}}
      />
    );

    expect(screen.getByText("$150k - $180k")).toBeInTheDocument();
  });

  it("displays dash when no salary is provided", () => {
    const application = createApplication({
      salaryMin: undefined,
      salaryMax: undefined,
    });

    render(
      <ApplicationTable
        applications={[application]}
        onSelectApplication={() => {}}
      />
    );

    const row = screen.getByRole("row", { name: /test company/i });
    expect(within(row).getByText("-")).toBeInTheDocument();
  });

  it("calls onSelectApplication when row is clicked", async () => {
    const user = userEvent.setup();
    const application = createApplication({ id: "app-123" });
    const handleSelect = vi.fn();

    render(
      <ApplicationTable
        applications={[application]}
        onSelectApplication={handleSelect}
      />
    );

    const row = screen.getByRole("row", { name: /test company/i });
    await user.click(row);

    expect(handleSelect).toHaveBeenCalledWith("app-123");
  });

  it("renders multiple applications", () => {
    const applications = [
      createApplication({ id: "1", companyName: "Company A" }),
      createApplication({ id: "2", companyName: "Company B" }),
      createApplication({ id: "3", companyName: "Company C" }),
    ];

    render(
      <ApplicationTable
        applications={applications}
        onSelectApplication={() => {}}
      />
    );

    expect(screen.getByText("Company A")).toBeInTheDocument();
    expect(screen.getByText("Company B")).toBeInTheDocument();
    expect(screen.getByText("Company C")).toBeInTheDocument();
  });

  it("makes column headers clickable for sorting", () => {
    render(<ApplicationTable applications={[]} onSelectApplication={() => {}} />);

    const companyHeader = screen.getByRole("columnheader", { name: /company/i });
    expect(companyHeader).toHaveStyle({ cursor: "pointer" });
  });

  it("sorts by company name ascending when company header is clicked", async () => {
    const user = userEvent.setup();
    const applications = [
      createApplication({ id: "1", companyName: "Zebra Inc" }),
      createApplication({ id: "2", companyName: "Acme Corp" }),
      createApplication({ id: "3", companyName: "Beta LLC" }),
    ];

    render(
      <ApplicationTable
        applications={applications}
        onSelectApplication={() => {}}
      />
    );

    await user.click(screen.getByRole("columnheader", { name: /company/i }));

    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);

    expect(within(dataRows[0]).getByText("Acme Corp")).toBeInTheDocument();
    expect(within(dataRows[1]).getByText("Beta LLC")).toBeInTheDocument();
    expect(within(dataRows[2]).getByText("Zebra Inc")).toBeInTheDocument();
  });

  it("sorts by company name descending when company header is clicked twice", async () => {
    const user = userEvent.setup();
    const applications = [
      createApplication({ id: "1", companyName: "Acme Corp" }),
      createApplication({ id: "2", companyName: "Zebra Inc" }),
      createApplication({ id: "3", companyName: "Beta LLC" }),
    ];

    render(
      <ApplicationTable
        applications={applications}
        onSelectApplication={() => {}}
      />
    );

    const header = screen.getByRole("columnheader", { name: /company/i });
    await user.click(header);
    await user.click(header);

    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);

    expect(within(dataRows[0]).getByText("Zebra Inc")).toBeInTheDocument();
    expect(within(dataRows[1]).getByText("Beta LLC")).toBeInTheDocument();
    expect(within(dataRows[2]).getByText("Acme Corp")).toBeInTheDocument();
  });

  it("sorts by score when score header is clicked", async () => {
    const user = userEvent.setup();
    const applications = [
      createApplication({ id: "1", companyName: "Low Score", score: 2 }),
      createApplication({ id: "2", companyName: "High Score", score: 5 }),
      createApplication({ id: "3", companyName: "Mid Score", score: 3 }),
    ];

    render(
      <ApplicationTable
        applications={applications}
        onSelectApplication={() => {}}
      />
    );

    await user.click(screen.getByRole("columnheader", { name: /score/i }));

    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);

    expect(within(dataRows[0]).getByText("Low Score")).toBeInTheDocument();
    expect(within(dataRows[1]).getByText("Mid Score")).toBeInTheDocument();
    expect(within(dataRows[2]).getByText("High Score")).toBeInTheDocument();
  });

  it("shows sort indicator on sorted column", async () => {
    const user = userEvent.setup();
    render(
      <ApplicationTable
        applications={[createApplication()]}
        onSelectApplication={() => {}}
      />
    );

    const header = screen.getByRole("columnheader", { name: /company/i });
    await user.click(header);

    expect(header).toHaveTextContent(/▲/);
  });
});
