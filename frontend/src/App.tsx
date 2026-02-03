import { useState, useEffect } from "react";
import { ApplicationTable } from "./components/ApplicationTable";
import { StatusFilter } from "./components/StatusFilter";
import type { Storage } from "./storage";
import type { JobApplication, ApplicationStatus } from "./types";

interface AppProps {
  storage: Storage;
}

export function App({ storage }: AppProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setIsLoading(true);
    const apps = await storage.listApplications();
    setApplications(apps);
    setIsLoading(false);
  }

  const filteredApplications = statusFilter
    ? applications.filter((app) => app.status === statusFilter)
    : applications;

  function handleSelectApplication(id: string) {
    console.log("Selected application:", id);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Candidate Tracker
          </h1>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Application
          </button>
        </header>

        <div className="mb-6">
          <StatusFilter
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-gray-500">Loading...</div>
          ) : (
            <ApplicationTable
              applications={filteredApplications}
              onSelectApplication={handleSelectApplication}
            />
          )}
        </div>
      </div>
    </div>
  );
}
