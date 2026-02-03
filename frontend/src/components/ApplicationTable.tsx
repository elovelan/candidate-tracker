import type { JobApplication } from "../types";

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

export function ApplicationTable({
  applications,
  onSelectApplication,
}: ApplicationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
              Company
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
              Role
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
              Score
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
              Salary
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No applications yet
              </td>
            </tr>
          ) : (
            applications.map((app) => (
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
