# UI Design Prototypes

This document tracks the UI design exploration for the candidate tracker. Each design variant is developed on its own branch for comparison.

## Foundation (Complete)

**Branch:** `claude/ui-design-prototype-cbgAe`

The following foundation is in place and shared by all UI variants:

- **TypeScript types** (`frontend/src/types.ts`) - `JobApplication`, `Task`, `Interview`, `Note` interfaces
- **Storage layer** (`frontend/src/storage/`) - Abstract `Storage` interface with `localStorage` implementation
- **Tailwind CSS v4** - Utility-first styling via Vite plugin
- **Test setup** - Vitest + React Testing Library configured

All UI branches should be created from this foundation branch.

---

## Variant A: Table View

**Status:** Not started
**Branch:** TBD (create from `claude/ui-design-prototype-cbgAe`)

### Description

A data-dense table/grid view optimized for seeing all applications at once.

### Requirements

- Display all applications in a sortable table
- Columns: Company, Role, Status, Score, Salary Range, Last Updated
- Click column headers to sort
- Filter by status (dropdown or tabs)
- Click a row to open application detail view
- Responsive: stack or scroll horizontally on mobile

### Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  Candidate Tracker                        [+ Add Application]  │
├─────────────────────────────────────────────────────────────────┤
│  Filter: [All ▾]  [Applied] [Interviewing] [Offer] [Other]     │
├─────────────────────────────────────────────────────────────────┤
│  Company ▾    │ Role         │ Status       │ Score │ Salary   │
├───────────────┼──────────────┼──────────────┼───────┼──────────┤
│  Acme Corp    │ Sr. Engineer │ Interviewing │ ★★★★  │ 150-180k │
│  Tech Inc     │ Frontend Dev │ Applied      │ ★★★   │ 120-140k │
│  StartupXYZ   │ Fullstack    │ Offer        │ ★★★★★ │ 160-200k │
│  BigCo        │ Staff Eng    │ Rejected     │ ★★    │ 180-220k │
└───────────────┴──────────────┴──────────────┴───────┴──────────┘
```

---

## Variant B: Kanban Board with Rich Cards

**Status:** Not started
**Branch:** TBD (create from `claude/ui-design-prototype-cbgAe`)

### Description

A visual pipeline view with applications organized by status in columns. Cards show more than just the title - they include key details at a glance. Includes filtering capability.

### Requirements

- Columns for each status: Applied, Interviewing, Offer, Rejected/Withdrawn, Accepted
- Cards show: Company, Role, Score, and additional details (TBD in implementation)
- Filter bar to narrow down visible applications
- Potential for drag-and-drop status changes (stretch goal)
- Scrollable columns when many applications exist

### Card Content Options (to decide during implementation)

- Company name (required)
- Role name (required)
- Score as stars (required)
- Salary range
- Days since last update
- Upcoming interview indicator
- Pending tasks count
- Latest note preview

### Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  Candidate Tracker                              [+ Add Application] │
├─────────────────────────────────────────────────────────────────────┤
│  Filter: [_______________] [Score: Any ▾] [Has interviews ☐]       │
├─────────────────────────────────────────────────────────────────────┤
│  Applied (2)   │ Interviewing (1) │ Offer (1)    │ Accepted (0)    │
├────────────────┼──────────────────┼──────────────┼─────────────────┤
│ ┌────────────┐ │ ┌──────────────┐ │ ┌──────────┐ │                 │
│ │ Tech Inc   │ │ │ Acme Corp    │ │ │ StartupXYZ│ │                 │
│ │ Frontend   │ │ │ Sr. Engineer │ │ │ Fullstack │ │                 │
│ │ ★★★☆☆     │ │ │ ★★★★☆       │ │ │ ★★★★★    │ │                 │
│ │ $120-140k  │ │ │ $150-180k    │ │ │ $160-200k │ │                 │
│ │ 📅 Tomorrow │ │ │ 2 tasks left │ │ │ Decide by │ │                 │
│ └────────────┘ │ └──────────────┘ │ │ Feb 10    │ │                 │
│ ┌────────────┐ │                  │ └──────────┘ │                 │
│ │ BigCo      │ │                  │              │                 │
│ │ Staff Eng  │ │                  │              │                 │
│ │ ★★☆☆☆     │ │                  │              │                 │
│ └────────────┘ │                  │              │                 │
└────────────────┴──────────────────┴──────────────┴─────────────────┘
```

---

## Prompts for New Conversations

### Table View Prompt

```
I'm building a candidate tracker app. I'd like you to implement the Table View UI variant.

**Branch to work on:** Create a new branch from `claude/ui-design-prototype-cbgAe`

**Foundation already in place:**
- TypeScript types in `frontend/src/types.ts`
- Storage layer in `frontend/src/storage/` (use `localStorageImpl`)
- Tailwind CSS v4 configured
- Vitest + React Testing Library for tests

**Requirements:**
- Data-dense table showing all job applications
- Columns: Company, Role, Status, Score, Salary Range, Last Updated
- Sortable by clicking column headers
- Filter by status (tabs or dropdown)
- Click row to see detail view
- Follow TDD: write tests first

**Project principles (from CLAUDE.md):**
- Readability above all - self-documenting code
- Simplicity - use common patterns, avoid cleverness
- TDD workflow - failing test first, then implementation
- One component per file, tests next to source files

Please read `REQUIREMENTS.md` and `CLAUDE.md` for full context, then start implementing.
```

### Kanban Board Prompt

```
I'm building a candidate tracker app. I'd like you to implement a Kanban Board UI with rich cards.

**Branch to work on:** Create a new branch from `claude/ui-design-prototype-cbgAe`

**Foundation already in place:**
- TypeScript types in `frontend/src/types.ts`
- Storage layer in `frontend/src/storage/` (use `localStorageImpl`)
- Tailwind CSS v4 configured
- Vitest + React Testing Library for tests

**Requirements:**
- Kanban columns by status: Applied, Interviewing, Offer, Rejected/Withdrawn, Accepted
- Rich cards showing more than just title (company, role, score, plus additional details)
- Filter bar to narrow down applications
- Drag-and-drop for status changes is a stretch goal

**Card content to discuss:** I'd like the cards to show useful info at a glance. Let's figure out together what makes sense - options include salary range, days since update, upcoming interviews, pending task count, or note previews.

**Project principles (from CLAUDE.md):**
- Readability above all - self-documenting code
- Simplicity - use common patterns, avoid cleverness
- TDD workflow - failing test first, then implementation
- One component per file, tests next to source files

Please read `REQUIREMENTS.md` and `CLAUDE.md` for full context. Before building, let's discuss what information should appear on the cards.
```
