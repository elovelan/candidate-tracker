import type { JobApplication, Task, Interview, Note } from "../types";
import type { Storage } from "./storage";

const STORAGE_KEYS = {
  applications: "candidate-tracker:applications",
  tasks: "candidate-tracker:tasks",
  interviews: "candidate-tracker:interviews",
  notes: "candidate-tracker:notes",
} as const;

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function getStoredData<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setStoredData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const localStorageImpl: Storage = {
  // JobApplication methods
  async listApplications(): Promise<JobApplication[]> {
    return getStoredData<JobApplication>(STORAGE_KEYS.applications);
  },

  async getApplication(id: string): Promise<JobApplication | null> {
    const applications = getStoredData<JobApplication>(
      STORAGE_KEYS.applications
    );
    return applications.find((app) => app.id === id) ?? null;
  },

  async createApplication(
    application: Omit<JobApplication, "id" | "createdAt" | "updatedAt">
  ): Promise<JobApplication> {
    const applications = getStoredData<JobApplication>(
      STORAGE_KEYS.applications
    );
    const timestamp = now();
    const newApplication: JobApplication = {
      ...application,
      id: generateId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    applications.push(newApplication);
    setStoredData(STORAGE_KEYS.applications, applications);
    return newApplication;
  },

  async updateApplication(
    id: string,
    updates: Partial<Omit<JobApplication, "id" | "createdAt" | "updatedAt">>
  ): Promise<JobApplication> {
    const applications = getStoredData<JobApplication>(
      STORAGE_KEYS.applications
    );
    const index = applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error(`Application not found: ${id}`);
    }
    const updated: JobApplication = {
      ...applications[index],
      ...updates,
      updatedAt: now(),
    };
    applications[index] = updated;
    setStoredData(STORAGE_KEYS.applications, applications);
    return updated;
  },

  async deleteApplication(id: string): Promise<void> {
    const applications = getStoredData<JobApplication>(
      STORAGE_KEYS.applications
    );
    const filtered = applications.filter((app) => app.id !== id);
    setStoredData(STORAGE_KEYS.applications, filtered);

    // Also delete related entities
    const tasks = getStoredData<Task>(STORAGE_KEYS.tasks);
    setStoredData(
      STORAGE_KEYS.tasks,
      tasks.filter((t) => t.applicationId !== id)
    );

    const interviews = getStoredData<Interview>(STORAGE_KEYS.interviews);
    setStoredData(
      STORAGE_KEYS.interviews,
      interviews.filter((i) => i.applicationId !== id)
    );

    const notes = getStoredData<Note>(STORAGE_KEYS.notes);
    setStoredData(
      STORAGE_KEYS.notes,
      notes.filter((n) => n.applicationId !== id)
    );
  },

  // Task methods
  async listTasks(applicationId: string): Promise<Task[]> {
    const tasks = getStoredData<Task>(STORAGE_KEYS.tasks);
    return tasks.filter((task) => task.applicationId === applicationId);
  },

  async createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const tasks = getStoredData<Task>(STORAGE_KEYS.tasks);
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: now(),
    };
    tasks.push(newTask);
    setStoredData(STORAGE_KEYS.tasks, tasks);
    return newTask;
  },

  async updateTask(
    id: string,
    updates: Partial<Omit<Task, "id" | "applicationId" | "createdAt">>
  ): Promise<Task> {
    const tasks = getStoredData<Task>(STORAGE_KEYS.tasks);
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new Error(`Task not found: ${id}`);
    }
    const updated: Task = {
      ...tasks[index],
      ...updates,
    };
    tasks[index] = updated;
    setStoredData(STORAGE_KEYS.tasks, tasks);
    return updated;
  },

  async deleteTask(id: string): Promise<void> {
    const tasks = getStoredData<Task>(STORAGE_KEYS.tasks);
    setStoredData(
      STORAGE_KEYS.tasks,
      tasks.filter((t) => t.id !== id)
    );
  },

  // Interview methods
  async listInterviews(applicationId: string): Promise<Interview[]> {
    const interviews = getStoredData<Interview>(STORAGE_KEYS.interviews);
    return interviews.filter((i) => i.applicationId === applicationId);
  },

  async createInterview(interview: Omit<Interview, "id">): Promise<Interview> {
    const interviews = getStoredData<Interview>(STORAGE_KEYS.interviews);
    const newInterview: Interview = {
      ...interview,
      id: generateId(),
    };
    interviews.push(newInterview);
    setStoredData(STORAGE_KEYS.interviews, interviews);
    return newInterview;
  },

  async updateInterview(
    id: string,
    updates: Partial<Omit<Interview, "id" | "applicationId">>
  ): Promise<Interview> {
    const interviews = getStoredData<Interview>(STORAGE_KEYS.interviews);
    const index = interviews.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Interview not found: ${id}`);
    }
    const updated: Interview = {
      ...interviews[index],
      ...updates,
    };
    interviews[index] = updated;
    setStoredData(STORAGE_KEYS.interviews, interviews);
    return updated;
  },

  async deleteInterview(id: string): Promise<void> {
    const interviews = getStoredData<Interview>(STORAGE_KEYS.interviews);
    setStoredData(
      STORAGE_KEYS.interviews,
      interviews.filter((i) => i.id !== id)
    );
  },

  // Note methods
  async listNotes(applicationId: string): Promise<Note[]> {
    const notes = getStoredData<Note>(STORAGE_KEYS.notes);
    return notes.filter((note) => note.applicationId === applicationId);
  },

  async createNote(note: Omit<Note, "id" | "createdAt">): Promise<Note> {
    const notes = getStoredData<Note>(STORAGE_KEYS.notes);
    const newNote: Note = {
      ...note,
      id: generateId(),
      createdAt: now(),
    };
    notes.push(newNote);
    setStoredData(STORAGE_KEYS.notes, notes);
    return newNote;
  },

  async updateNote(
    id: string,
    updates: Partial<Omit<Note, "id" | "applicationId" | "createdAt">>
  ): Promise<Note> {
    const notes = getStoredData<Note>(STORAGE_KEYS.notes);
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Note not found: ${id}`);
    }
    const updated: Note = {
      ...notes[index],
      ...updates,
    };
    notes[index] = updated;
    setStoredData(STORAGE_KEYS.notes, notes);
    return updated;
  },

  async deleteNote(id: string): Promise<void> {
    const notes = getStoredData<Note>(STORAGE_KEYS.notes);
    setStoredData(
      STORAGE_KEYS.notes,
      notes.filter((n) => n.id !== id)
    );
  },
};
