import { describe, it, expect, beforeEach, vi } from "vitest";
import { localStorageImpl } from "./localStorage";

describe("localStorageImpl", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn(() => "test-uuid-" + Math.random().toString(36)),
    });
  });

  describe("JobApplication", () => {
    it("returns empty array when no applications exist", async () => {
      const applications = await localStorageImpl.listApplications();
      expect(applications).toEqual([]);
    });

    it("creates an application with generated id and timestamps", async () => {
      const application = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      expect(application.companyName).toBe("Acme Corp");
      expect(application.roleName).toBe("Software Engineer");
      expect(application.score).toBe(4);
      expect(application.status).toBe("applied");
      expect(application.id).toContain("test-uuid-");
      expect(application.createdAt).toBeDefined();
      expect(application.updatedAt).toBeDefined();
    });

    it("lists created applications", async () => {
      await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });
      await localStorageImpl.createApplication({
        companyName: "Tech Inc",
        roleName: "Frontend Developer",
        score: 3,
        status: "interviewing",
      });

      const applications = await localStorageImpl.listApplications();
      expect(applications).toHaveLength(2);
    });

    it("gets an application by id", async () => {
      const created = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      const found = await localStorageImpl.getApplication(created.id);
      expect(found).toEqual(created);
    });

    it("returns null for non-existent application", async () => {
      const found = await localStorageImpl.getApplication("non-existent");
      expect(found).toBeNull();
    });

    it("updates an application", async () => {
      const created = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      const updated = await localStorageImpl.updateApplication(created.id, {
        status: "interviewing",
        score: 5,
      });

      expect(updated.status).toBe("interviewing");
      expect(updated.score).toBe(5);
      expect(updated.companyName).toBe("Acme Corp");
      expect(updated.updatedAt).toBeDefined();
      expect(updated.createdAt).toBe(created.createdAt);
    });

    it("throws when updating non-existent application", async () => {
      await expect(
        localStorageImpl.updateApplication("non-existent", { score: 5 })
      ).rejects.toThrow("Application not found");
    });

    it("deletes an application and related entities", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      await localStorageImpl.createTask({
        applicationId: app.id,
        description: "Prepare resume",
        done: false,
      });

      await localStorageImpl.deleteApplication(app.id);

      const applications = await localStorageImpl.listApplications();
      const tasks = await localStorageImpl.listTasks(app.id);

      expect(applications).toHaveLength(0);
      expect(tasks).toHaveLength(0);
    });
  });

  describe("Task", () => {
    it("creates and lists tasks for an application", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      await localStorageImpl.createTask({
        applicationId: app.id,
        description: "Prepare resume",
        done: false,
      });
      await localStorageImpl.createTask({
        applicationId: app.id,
        description: "Research company",
        done: false,
      });

      const tasks = await localStorageImpl.listTasks(app.id);
      expect(tasks).toHaveLength(2);
      expect(tasks[0].description).toBe("Prepare resume");
    });

    it("updates a task", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      const task = await localStorageImpl.createTask({
        applicationId: app.id,
        description: "Prepare resume",
        done: false,
      });

      const updated = await localStorageImpl.updateTask(task.id, { done: true });
      expect(updated.done).toBe(true);
    });

    it("deletes a task", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      const task = await localStorageImpl.createTask({
        applicationId: app.id,
        description: "Prepare resume",
        done: false,
      });

      await localStorageImpl.deleteTask(task.id);
      const tasks = await localStorageImpl.listTasks(app.id);
      expect(tasks).toHaveLength(0);
    });
  });

  describe("Interview", () => {
    it("creates and lists interviews for an application", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      await localStorageImpl.createInterview({
        applicationId: app.id,
        dateTime: "2025-01-15T10:00:00Z",
        interviewType: "phone screen",
      });

      const interviews = await localStorageImpl.listInterviews(app.id);
      expect(interviews).toHaveLength(1);
      expect(interviews[0].interviewType).toBe("phone screen");
    });

    it("updates an interview", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      const interview = await localStorageImpl.createInterview({
        applicationId: app.id,
        dateTime: "2025-01-15T10:00:00Z",
        interviewType: "phone screen",
      });

      const updated = await localStorageImpl.updateInterview(interview.id, {
        notes: "Went well!",
      });
      expect(updated.notes).toBe("Went well!");
    });

    it("deletes an interview", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      const interview = await localStorageImpl.createInterview({
        applicationId: app.id,
        dateTime: "2025-01-15T10:00:00Z",
        interviewType: "phone screen",
      });

      await localStorageImpl.deleteInterview(interview.id);
      const interviews = await localStorageImpl.listInterviews(app.id);
      expect(interviews).toHaveLength(0);
    });
  });

  describe("Note", () => {
    it("creates and lists notes for an application", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      await localStorageImpl.createNote({
        applicationId: app.id,
        content: "Great company culture",
      });

      const notes = await localStorageImpl.listNotes(app.id);
      expect(notes).toHaveLength(1);
      expect(notes[0].content).toBe("Great company culture");
    });

    it("updates a note", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      const note = await localStorageImpl.createNote({
        applicationId: app.id,
        content: "Great company culture",
      });

      const updated = await localStorageImpl.updateNote(note.id, {
        content: "Updated: Great company culture and benefits",
      });
      expect(updated.content).toBe("Updated: Great company culture and benefits");
    });

    it("deletes a note", async () => {
      const app = await localStorageImpl.createApplication({
        companyName: "Acme Corp",
        roleName: "Software Engineer",
        score: 4,
        status: "applied",
      });

      const note = await localStorageImpl.createNote({
        applicationId: app.id,
        content: "Great company culture",
      });

      await localStorageImpl.deleteNote(note.id);
      const notes = await localStorageImpl.listNotes(app.id);
      expect(notes).toHaveLength(0);
    });
  });
});
