import type { ApplicationStatus } from "../types";

interface StatusFilterProps {
  selectedStatus: ApplicationStatus | null;
  onStatusChange: (status: ApplicationStatus | null) => void;
}

const STATUSES: ApplicationStatus[] = [
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
  "accepted",
];

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  const baseClasses =
    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses =
    "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700";

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
      <button
        type="button"
        onClick={() => onStatusChange(null)}
        className={`${baseClasses} ${selectedStatus === null ? activeClasses : inactiveClasses}`}
        aria-pressed={selectedStatus === null}
      >
        All
      </button>
      {STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onStatusChange(status)}
          className={`${baseClasses} ${selectedStatus === status ? activeClasses : inactiveClasses}`}
          aria-pressed={selectedStatus === status}
        >
          {formatStatus(status)}
        </button>
      ))}
    </div>
  );
}
