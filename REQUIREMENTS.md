# Candidate Tracker — Requirements

## Overview

A single-user job application tracker. The user is applying for multiple jobs and wants to track the status, tasks, interviews, notes, and overall sentiment for each application.

## Data Model

### JobApplication

The top-level entity. One per company/role.

| Field            | Type     | Description                                      |
|------------------|----------|--------------------------------------------------|
| id               | string   | Unique identifier (UUID)                         |
| companyName      | string   | Name of the company                              |
| roleName         | string   | Job title / role name                            |
| score            | number   | 1–5, how the user feels about this opportunity   |
| salaryMin        | number   | Low end of salary range (optional)               |
| salaryMax        | number   | High end of salary range (optional)              |
| status           | string   | One of: "applied", "interviewing", "offer", "rejected", "withdrawn", "accepted" |
| createdAt        | string   | ISO 8601 timestamp                               |
| updatedAt        | string   | ISO 8601 timestamp                               |

### Task

Action items tied to a specific application.

| Field            | Type     | Description                                      |
|------------------|----------|--------------------------------------------------|
| id               | string   | Unique identifier (UUID)                         |
| applicationId    | string   | Foreign key to JobApplication                    |
| description      | string   | What needs to be done                            |
| done             | boolean  | Whether the task is complete                     |
| createdAt        | string   | ISO 8601 timestamp                               |

### Interview

Scheduled interviews tied to a specific application.

| Field            | Type     | Description                                      |
|------------------|----------|--------------------------------------------------|
| id               | string   | Unique identifier (UUID)                         |
| applicationId    | string   | Foreign key to JobApplication                    |
| dateTime         | string   | ISO 8601 timestamp of the interview              |
| interviewType    | string   | e.g. "phone screen", "technical", "onsite", "behavioral", "other" |
| notes            | string   | Optional notes about this specific interview     |

### Note

Freeform notes tied to a specific application.

| Field            | Type     | Description                                      |
|------------------|----------|--------------------------------------------------|
| id               | string   | Unique identifier (UUID)                         |
| applicationId    | string   | Foreign key to JobApplication                    |
| content          | string   | The note text (plain text)                       |
| createdAt        | string   | ISO 8601 timestamp                               |

## Features

### Application List

- View all job applications in a list
- See company name, role, status, score, and salary range at a glance
- Sort by any column
- Filter by status

### Application Detail

- View and edit all fields for a single application
- Manage tasks (add, toggle done, delete)
- Manage interviews (add, edit, delete)
- Manage notes (add, edit, delete)
- Change score (1–5 rating)
- Change status

### Add Application

- Form to create a new job application with company name and role as required fields
- All other fields optional with sensible defaults (status defaults to "applied", score defaults to 3)

## Storage

### Phase 1 (current): localStorage

All data stored in the browser via `localStorage`. This is intentionally simple and insecure — the goal is fast UX iteration.

The storage layer should be behind a simple interface so it can be replaced with API calls later without changing component code.

### Phase 2 (future): Go backend + GCP Spanner

A minimal Go REST API will replace localStorage. The frontend will swap the storage implementation but the interface stays the same.

## UI Guidelines

- Keep the UI simple and functional. Prioritize clarity over polish.
- The UI approach is expected to change. Multiple designs may be tried.
- Components should be small and focused so they are easy to rearrange or replace.
- No specific component library is mandated — each UI iteration can choose its own approach.
