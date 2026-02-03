import { useState } from "react";
import type { JobApplication } from "../types";

type SortField = "companyName" | "roleName" | "status" | "score" | "salaryMin" | "updatedAt";
type SortDirection = "asc" | "desc";

interface SortState {
  field: SortField;
  direction: SortDirection;
}

interface ApplicationTableProps {
  applications: JobApplication[];
  onSelectApplication: (id: string) => void;
}

function formatSalary(min?: number, max?: number): string {
  if (min === undefined && max === undefined) {
    return "-";
  }
  if (min !== undefined && max !== undefined) {
    return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
  }
  if (min !== undefined) {
    return `$${Math.round(min / 1000)}k+`;
  }
  return `Up to $${Math.round(max! / 1000)}k`;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function sortApplications(
  applications: JobApplication[],
  sort: SortState | null
): JobApplication[] {
  if (!sort) return applications;

  return [...applications].sort((a, b) => {
    let comparison = 0;
    const field = sort.field;

    if (field === "companyName" || field === "roleName" || field === "status") {
      comparison = a[field].localeCompare(b[field]);
    } else if (field === "score") {
      comparison = a.score - b.score;
    } else if (field === "salaryMin") {
      const aVal = a.salaryMin ?? 0;
      const bVal = b.salaryMin ?? 0;
      comparison = aVal - bVal;
    } else if (field === "updatedAt") {
      comparison = a.updatedAt.localeCompare(b.updatedAt);
    }

    return sort.direction === "asc" ? comparison : -comparison;
  });
}

export function ApplicationTable({
  applications,
  onSelectApplication,
}: ApplicationTableProps) {
  const [sort, setSort] = useState<SortState | null>(null);

  const handleSort = (field: SortField) => {
    setSort((current) => {
      if (current?.field === field) {
        return current.direction === "asc"
          ? { field, direction: "desc" }
          : null;
      }
      return { field, direction: "asc" };
    });
  };

  const sortedApplications = sortApplications(applications, sort);

  const getSortIndicator = (field: SortField) => {
    if (sort?.field !== field) return null;
    return sort.direction === "asc" ? " ▲" : " ▼";
  };

  const headerClass =
    "px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 select-none";

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th
              className={headerClass}
              onClick={() => handleSort("companyName")}
              style={{ cursor: "pointer" }}
            >
              Company{getSortIndicator("companyName")}
            </th>
            <th
              className={headerClass}
              onClick={() => handleSort("roleName")}
              style={{ cursor: "pointer" }}
            >
              Role{getSortIndicator("roleName")}
            </th>
            <th
              className={headerClass}
              onClick={() => handleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Status{getSortIndicator("status")}
            </th>
            <th
              className={headerClass}
              onClick={() => handleSort("score")}
              style={{ cursor: "pointer" }}
            >
              Score{getSortIndicator("score")}
            </th>
            <th
              className={headerClass}
              onClick={() => handleSort("salaryMin")}
              style={{ cursor: "pointer" }}
            >
              Salary{getSortIndicator("salaryMin")}
            </th>
            <th
              className={headerClass}
              onClick={() => handleSort("updatedAt")}
              style={{ cursor: "pointer" }}
            >
              Updated{getSortIndicator("updatedAt")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedApplications.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No applications yet
              </td>
            </tr>
          ) : (
            sortedApplications.map((app) => (
              <tr
                key={app.id}
                onClick={() => onSelectApplication(app.id)}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <td className="px-4 py-3 font-medium">{app.companyName}</td>
                <td className="px-4 py-3">{app.roleName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3">
                  <ScoreDisplay score={app.score} />
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {formatSalary(app.salaryMin, app.salaryMax)}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {formatDate(app.updatedAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorClasses: Record<string, string> = {
    applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    interviewing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    offer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded ${colorClasses[status] || colorClasses.applied}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function ScoreDisplay({ score }: { score: number }) {
  const maxScore = 5;
  const stars = [];

  for (let i = 1; i <= maxScore; i++) {
    stars.push(
      <span
        key={i}
        className={i <= score ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
      >
        ★
      </span>
    );
  }

  return <span className="text-sm">{stars}</span>;
}
