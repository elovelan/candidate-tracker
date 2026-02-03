import type { JobApplication, Task, Interview, Note } from "../types";

export interface Storage {
  // JobApplication methods
  listApplications(): Promise<JobApplication[]>;
  getApplication(id: string): Promise<JobApplication | null>;
  createApplication(
    application: Omit<JobApplication, "id" | "createdAt" | "updatedAt">
  ): Promise<JobApplication>;
  updateApplication(
    id: string,
    updates: Partial<Omit<JobApplication, "id" | "createdAt" | "updatedAt">>
  ): Promise<JobApplication>;
  deleteApplication(id: string): Promise<void>;

  // Task methods
  listTasks(applicationId: string): Promise<Task[]>;
  createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task>;
  updateTask(
    id: string,
    updates: Partial<Omit<Task, "id" | "applicationId" | "createdAt">>
  ): Promise<Task>;
  deleteTask(id: string): Promise<void>;

  // Interview methods
  listInterviews(applicationId: string): Promise<Interview[]>;
  createInterview(interview: Omit<Interview, "id">): Promise<Interview>;
  updateInterview(
    id: string,
    updates: Partial<Omit<Interview, "id" | "applicationId">>
  ): Promise<Interview>;
  deleteInterview(id: string): Promise<void>;

  // Note methods
  listNotes(applicationId: string): Promise<Note[]>;
  createNote(note: Omit<Note, "id" | "createdAt">): Promise<Note>;
  updateNote(
    id: string,
    updates: Partial<Omit<Note, "id" | "applicationId" | "createdAt">>
  ): Promise<Note>;
  deleteNote(id: string): Promise<void>;
}
