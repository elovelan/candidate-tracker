import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StatusFilter } from "./StatusFilter";
import type { ApplicationStatus } from "../types";

describe("StatusFilter", () => {
  const allStatuses: ApplicationStatus[] = [
    "applied",
    "interviewing",
    "offer",
    "rejected",
    "withdrawn",
    "accepted",
  ];

  it("renders all status filter buttons", () => {
    render(<StatusFilter selectedStatus={null} onStatusChange={() => {}} />);

    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /applied/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /interviewing/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /offer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rejected/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /withdrawn/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accepted/i })).toBeInTheDocument();
  });

  it("highlights the 'All' button when no status is selected", () => {
    render(<StatusFilter selectedStatus={null} onStatusChange={() => {}} />);

    const allButton = screen.getByRole("button", { name: /all/i });
    expect(allButton).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights the selected status button", () => {
    render(<StatusFilter selectedStatus="interviewing" onStatusChange={() => {}} />);

    const interviewingButton = screen.getByRole("button", { name: /interviewing/i });
    expect(interviewingButton).toHaveAttribute("aria-pressed", "true");

    const allButton = screen.getByRole("button", { name: /all/i });
    expect(allButton).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onStatusChange with null when 'All' is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<StatusFilter selectedStatus="applied" onStatusChange={handleChange} />);

    await user.click(screen.getByRole("button", { name: /all/i }));

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it("calls onStatusChange with the status when a status button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<StatusFilter selectedStatus={null} onStatusChange={handleChange} />);

    await user.click(screen.getByRole("button", { name: /offer/i }));

    expect(handleChange).toHaveBeenCalledWith("offer");
  });
});
